// In-Memory Resilient Data Store for DineDesk
// Ensures zero-failure demo availability on serverless platforms (e.g. Vercel)
// when external SQL databases are unconfigured or disconnected.

import { initialData as initialRaw } from './initialData';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  isAvailable: boolean;
  isVeg: boolean;
  isGlutenFree: boolean;
  spiceLevel: number;
  prepTimeMinutes: number;
  allergens: string;
  restaurantId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  restaurantId: string;
  menuItems: MenuItem[];
}

interface Table {
  id: string;
  number: string;
  capacity: number;
  section: string;
  status: string;
  qrCodeUrl: string | null;
  restaurantId: string;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  currency: string;
  taxRate: number;
  categories: Category[];
  tables: Table[];
  happyHourRules: any[];
  inventory: any[];
  users: any[];
}

// Global in-memory state cache for serverless runtime
const g = global as unknown as {
  __dinedesk_store?: {
    restaurants: Restaurant[];
    orders: any[];
    reservations: any[];
    reviews: any[];
    waiterCalls: any[];
  };
};

if (!g.__dinedesk_store) {
  // Deep clone initial JSON data
  const parsed = JSON.parse(JSON.stringify(initialRaw));
  g.__dinedesk_store = {
    restaurants: parsed.restaurants || [],
    orders: parsed.orders || [],
    reservations: [
      {
        id: 'res-seed-1',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav@example.com',
        customerPhone: '+91 98765 43210',
        partySize: 4,
        date: new Date().toISOString().split('T')[0],
        timeSlot: '20:00',
        status: 'CONFIRMED',
        notes: 'Window table preferred',
        tableId: parsed.restaurants?.[0]?.tables?.[0]?.id || null,
        createdAt: new Date().toISOString(),
      }
    ],
    reviews: [
      {
        id: 'rev-seed-1',
        customerName: 'Pooja Hegde',
        rating: 5,
        foodRating: 5,
        serviceRating: 5,
        comment: 'Authentic flavors and exceptional royal hospitality! The Dal Makhani Bukhara is unmatched.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rev-seed-2',
        customerName: 'Kunal Kapoor',
        rating: 5,
        foodRating: 5,
        serviceRating: 4,
        comment: 'Loved the Peshawari Naan and Galouti Kebabs. Smooth ordering experience right from the table.',
        createdAt: new Date().toISOString(),
      }
    ],
    waiterCalls: [
      {
        id: 'wc-seed-1',
        tableId: parsed.restaurants?.[0]?.tables?.[1]?.id || 'tbl-1',
        reason: 'Water & Ice',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      }
    ],
  };
}

const store = g.__dinedesk_store;

export const dataStore = {
  getRestaurants() {
    return store.restaurants.map((r) => ({
      ...r,
      _count: {
        menuItems: r.categories.reduce((acc, c) => acc + (c.menuItems?.length || 0), 0),
        tables: r.tables.length,
        categories: r.categories.length,
      },
    }));
  },

  getRestaurantBySlug(slug: string) {
    return store.restaurants.find((r) => r.slug === slug) || store.restaurants[0] || null;
  },

  getRestaurantById(id: string) {
    return store.restaurants.find((r) => r.id === id) || null;
  },

  getMenu(slug?: string | null, restaurantId?: string | null) {
    let restaurant = null;
    if (slug) {
      restaurant = store.restaurants.find((r) => r.slug === slug);
    } else if (restaurantId) {
      restaurant = store.restaurants.find((r) => r.id === restaurantId);
    }
    if (!restaurant) {
      restaurant = store.restaurants[0];
    }

    if (!restaurant) {
      return { restaurant: null, categories: [], happyHours: [] };
    }

    return {
      restaurant,
      categories: restaurant.categories || [],
      happyHours: restaurant.happyHourRules || [],
    };
  },

  updateMenuItemAvailability(id: string, isAvailable: boolean) {
    for (const r of store.restaurants) {
      for (const cat of r.categories) {
        for (const item of cat.menuItems) {
          if (item.id === id) {
            item.isAvailable = isAvailable;
            return item;
          }
        }
      }
    }
    return null;
  },

  getTables(slug?: string | null, restaurantId?: string | null) {
    let restaurant = null;
    if (slug) {
      restaurant = store.restaurants.find((r) => r.slug === slug);
    } else if (restaurantId) {
      restaurant = store.restaurants.find((r) => r.id === restaurantId);
    }
    if (!restaurant) restaurant = store.restaurants[0];

    const tables = restaurant ? restaurant.tables : store.restaurants.flatMap((r) => r.tables);

    return tables.map((t) => {
      const activeOrders = store.orders.filter(
        (o) => o.tableId === t.id && ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)
      );
      const activeCalls = store.waiterCalls.filter((c) => c.tableId === t.id && c.status === 'ACTIVE');
      return {
        ...t,
        orders: activeOrders,
        waiterCalls: activeCalls,
      };
    });
  },

  updateTableStatus(tableId: string, status: string) {
    for (const r of store.restaurants) {
      for (const t of r.tables) {
        if (t.id === tableId) {
          t.status = status;
          return t;
        }
      }
    }
    return null;
  },

  getOrders(slug?: string | null, status?: string | null, tableId?: string | null, restaurantId?: string | null) {
    let orders = [...store.orders];

    if (slug) {
      const rest = store.restaurants.find((r) => r.slug === slug);
      if (rest) orders = orders.filter((o) => o.restaurantId === rest.id);
    } else if (restaurantId) {
      orders = orders.filter((o) => o.restaurantId === restaurantId);
    }

    if (status === 'ACTIVE') {
      orders = orders.filter((o) => ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status));
    } else if (status) {
      orders = orders.filter((o) => o.status === status);
    }

    if (tableId) {
      orders = orders.filter((o) => o.tableId === tableId);
    }

    // Attach table and menuItem details
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createOrder(data: {
    restaurantId?: string;
    tableId?: string;
    tableNumber?: string;
    customerName?: string;
    customerPhone?: string;
    guestNotes?: string;
    items: Array<{ menuItemId: string; quantity: number; notes?: string; selectedOptions?: any }>;
  }) {
    const rest = store.restaurants.find((r) => r.id === data.restaurantId) || store.restaurants[0];
    const orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

    // Calculate totals
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const it of data.items) {
      // Find item
      let menuItem: MenuItem | null = null;
      for (const r of store.restaurants) {
        for (const cat of r.categories) {
          const found = cat.menuItems.find((m) => m.id === it.menuItemId);
          if (found) {
            menuItem = found;
            break;
          }
        }
        if (menuItem) break;
      }

      const unitPrice = menuItem ? menuItem.price : 250;
      const subtotal = unitPrice * it.quantity;
      totalAmount += subtotal;

      orderItems.push({
        id: 'oi-' + Math.random().toString(36).slice(2, 9),
        menuItemId: it.menuItemId,
        quantity: it.quantity,
        unitPrice,
        subtotal,
        notes: it.notes || '',
        selectedOptions: typeof it.selectedOptions === 'object' ? JSON.stringify(it.selectedOptions) : it.selectedOptions || null,
        menuItem: menuItem || {
          id: it.menuItemId,
          name: 'Special Delicacy',
          price: unitPrice,
          imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        },
      });
    }

    const taxAmount = (totalAmount * (rest ? rest.taxRate : 5)) / 100;

    let targetTable = null;
    if (data.tableId) {
      for (const r of store.restaurants) {
        const found = r.tables.find((t) => t.id === data.tableId || t.number === data.tableId);
        if (found) {
          targetTable = found;
          found.status = 'OCCUPIED';
          break;
        }
      }
    } else if (data.tableNumber && rest) {
      const found = rest.tables.find((t) => t.number === data.tableNumber);
      if (found) {
        targetTable = found;
        found.status = 'OCCUPIED';
      }
    }

    const newOrder = {
      id: 'ord-' + Math.random().toString(36).slice(2, 9),
      orderNumber,
      type: 'DINE_IN',
      status: 'PLACED',
      paymentStatus: 'PENDING',
      tableId: targetTable ? targetTable.id : null,
      table: targetTable,
      totalAmount: totalAmount + taxAmount,
      discountAmount: 0,
      taxAmount,
      guestNotes: data.guestNotes || null,
      customerName: data.customerName || 'Guest Customer',
      customerPhone: data.customerPhone || null,
      estimatedMinutes: 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      restaurantId: rest ? rest.id : 'rest-1',
      items: orderItems,
    };

    store.orders.unshift(newOrder);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: string) {
    const order = store.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      return order;
    }
    return null;
  },

  getReservations() {
    return store.reservations.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createReservation(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    partySize: number;
    date: string;
    timeSlot: string;
    notes?: string;
  }) {
    const newRes = {
      id: 'res-' + Math.random().toString(36).slice(2, 9),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      partySize: Number(data.partySize) || 2,
      date: data.date,
      timeSlot: data.timeSlot,
      status: 'CONFIRMED',
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
    };
    store.reservations.unshift(newRes);
    return newRes;
  },

  getReviews() {
    return store.reviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createReview(data: {
    orderId?: string;
    menuItemId?: string;
    customerName?: string;
    rating: number;
    foodRating?: number;
    serviceRating?: number;
    comment: string;
  }) {
    const newRev = {
      id: 'rev-' + Math.random().toString(36).slice(2, 9),
      customerName: data.customerName || 'Foodie Explorer',
      rating: Number(data.rating) || 5,
      foodRating: Number(data.foodRating) || Number(data.rating) || 5,
      serviceRating: Number(data.serviceRating) || 5,
      comment: data.comment,
      orderId: data.orderId || null,
      menuItemId: data.menuItemId || null,
      createdAt: new Date().toISOString(),
    };
    store.reviews.unshift(newRev);
    return newRev;
  },

  getWaiterCalls() {
    return store.waiterCalls.filter((c) => c.status === 'ACTIVE');
  },

  createWaiterCall(data: { tableId: string; reason?: string }) {
    const newCall = {
      id: 'wc-' + Math.random().toString(36).slice(2, 9),
      tableId: data.tableId,
      reason: data.reason || 'Assistance',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    store.waiterCalls.unshift(newCall);
    return newCall;
  },

  resolveWaiterCall(callId: string) {
    const call = store.waiterCalls.find((c) => c.id === callId);
    if (call) {
      call.status = 'RESOLVED';
      return call;
    }
    return null;
  },

  getAnalytics() {
    const totalOrders = store.orders.length;
    const totalRevenue = store.orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const activeTickets = store.orders.filter((o) =>
      ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)
    ).length;

    const inventory = store.restaurants[0]?.inventory || [];
    const happyHours = store.restaurants[0]?.happyHourRules || [];

    return {
      orders: store.orders,
      inventory,
      happyHours,
      metrics: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        activeTickets,
        avgOrderValue: totalOrders ? Math.round(totalRevenue / totalOrders) : 0,
      },
    };
  },
};
