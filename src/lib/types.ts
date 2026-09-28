export interface MenuItem {
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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  menuItems?: MenuItem[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: string[];
  spiceLevel: number;
  notes: string;
  unitPrice: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  selectedOptions?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: 'DINE_IN' | 'PICKUP' | 'DELIVERY';
  status: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID';
  tableId?: string;
  table?: { number: string; section: string };
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  guestNotes?: string;
  customerName: string;
  customerPhone?: string;
  estimatedMinutes: number;
  createdAt: string;
  items: OrderItem[];
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  section: string;
  status: 'FREE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  qrCodeUrl?: string;
}

export interface WaiterCall {
  id: string;
  tableId: string;
  table: Table;
  reason: string;
  status: 'ACTIVE' | 'RESOLVED';
  createdAt: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  date: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
  tableId?: string;
  table?: Table;
}

export interface Review {
  id: string;
  orderId?: string;
  customerName: string;
  rating: number;
  foodRating: number;
  serviceRating: number;
  comment: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  costPerUnit: number;
  reorderPredictedDays: number;
}

export interface HappyHourRule {
  id: string;
  title: string;
  discountPercent: number;
  startHour: number;
  endHour: number;
  daysOfWeek: string;
  isActive: boolean;
  targetCategory: string;
}
