const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DineDesk Multi-Tenant Indian Gastronomy Database Seeding...');

  // Clean existing data
  await prisma.review.deleteMany().catch(() => {});
  await prisma.payment.deleteMany().catch(() => {});
  await prisma.orderItem.deleteMany().catch(() => {});
  await prisma.order.deleteMany().catch(() => {});
  await prisma.waiterCall.deleteMany().catch(() => {});
  await prisma.reservation.deleteMany().catch(() => {});
  await prisma.menuItem.deleteMany().catch(() => {});
  await prisma.category.deleteMany().catch(() => {});
  await prisma.table.deleteMany().catch(() => {});
  await prisma.inventoryItem.deleteMany().catch(() => {});
  await prisma.happyHourRule.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});
  await prisma.restaurant.deleteMany().catch(() => {});

  // =========================================================================
  // 1. RESTAURANT 1: THE ROYAL RASOI GRAND BISTRO (North Indian / Mughlai)
  // =========================================================================
  const royalRasoi = await prisma.restaurant.create({
    data: {
      name: 'The Royal Rasoi Grand Bistro',
      slug: 'the-royal-rasoi',
      address: 'Plot 12, Connaught Circus, Central Delhi',
      phone: '+91 (11) 4890-2100',
      currency: 'INR',
      taxRate: 5.0,
    },
  });
  console.log('✅ Created Restaurant 1:', royalRasoi.name);

  // Users for Royal Rasoi
  const rasoiUsers = [
    { name: 'Aarav Sharma (Customer)', email: 'customer@dinedesk.com', password: 'password123', role: 'CUSTOMER', loyaltyPoints: 250 },
    { name: 'Rajesh Kumar (Senior Captain)', email: 'waiter@dinedesk.com', password: 'password123', role: 'WAITER' },
    { name: 'Ustad Imtiaz Khan (Head Chef)', email: 'kitchen@dinedesk.com', password: 'password123', role: 'KITCHEN' },
    { name: 'Priya Mehra (General Manager)', email: 'admin@dinedesk.com', password: 'password123', role: 'ADMIN' },
    { name: 'Vikramaditya (Platform SuperAdmin)', email: 'superadmin@dinedesk.com', password: 'password123', role: 'SUPERADMIN' },
  ];
  for (const u of rasoiUsers) {
    await prisma.user.create({ data: { ...u, restaurantId: royalRasoi.id } });
  }

  // Tables for Royal Rasoi
  const rasoiTableData = [
    { number: 'T-01', capacity: 2, section: 'Royal Haveli Hall', status: 'FREE' },
    { number: 'T-02', capacity: 4, section: 'Royal Haveli Hall', status: 'OCCUPIED' },
    { number: 'T-03', capacity: 4, section: 'Royal Haveli Hall', status: 'FREE' },
    { number: 'T-04', capacity: 6, section: 'Royal Haveli Hall', status: 'RESERVED' },
    { number: 'T-05', capacity: 2, section: 'Mughal Courtyard (Outdoor)', status: 'FREE' },
    { number: 'T-06', capacity: 4, section: 'Mughal Courtyard (Outdoor)', status: 'CLEANING' },
    { number: 'T-07', capacity: 4, section: 'Mughal Courtyard (Outdoor)', status: 'FREE' },
    { number: 'T-08', capacity: 8, section: 'Sheesh Mahal (VIP Lounge)', status: 'FREE' },
  ];
  const rasoiTables = [];
  for (const t of rasoiTableData) {
    const table = await prisma.table.create({
      data: { ...t, restaurantId: royalRasoi.id, qrCodeUrl: `http://localhost:3000/?restaurant=the-royal-rasoi&table=${t.number}` },
    });
    rasoiTables.push(table);
  }

  // Categories for Royal Rasoi
  const rasoiCategories = [
    { name: 'Tandoori Kebabs & Starters', slug: 'starters', sortOrder: 1 },
    { name: 'Shahi Curries & Gravies', slug: 'curries', sortOrder: 2 },
    { name: 'Dum Biryani & Pulao', slug: 'biryani', sortOrder: 3 },
    { name: 'Tandoori Roti & Naan', slug: 'breads', sortOrder: 4 },
    { name: 'Lassi, Mocktails & Chai', slug: 'beverages', sortOrder: 5 },
    { name: 'Desi Mithai & Desserts', slug: 'desserts', sortOrder: 6 },
  ];
  const rasoiCatMap = {};
  for (const c of rasoiCategories) {
    const cat = await prisma.category.create({ data: { ...c, restaurantId: royalRasoi.id } });
    rasoiCatMap[c.slug] = cat.id;
  }

  // Menu items for Royal Rasoi
  const rasoiItems = [
    {
      name: 'Paneer Tikka Angara',
      description: 'Charcoal-grilled cottage cheese cubes marinated in Kashmiri chili, hung yogurt, mustard oil, and bell peppers.',
      price: 340,
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['starters'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 2,
      prepTimeMinutes: 12,
      allergens: 'Dairy',
    },
    {
      name: 'Galouti Kebab Nawabi',
      description: 'Melt-in-mouth minced mutton patties infused with raw papaya, kewra essence, and 32 aromatic Awadhi spices.',
      price: 450,
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['starters'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 2,
      prepTimeMinutes: 15,
      allergens: 'None',
    },
    {
      name: 'Dilli 6 Papdi Chaat',
      description: 'Crisp flour crackers layered with spiced potatoes, boiled chickpeas, whipped sweet yogurt, mint chutney, and tamarind saunth.',
      price: 210,
      imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['starters'],
      isVeg: true,
      isGlutenFree: false,
      spiceLevel: 1,
      prepTimeMinutes: 6,
      allergens: 'Dairy, Gluten',
    },
    {
      name: 'Murgh Makhani (Butter Chicken)',
      description: 'Tandoor-smoked pulled chicken simmered in rich velvety San Marzano tomato reduction, churned butter, and cashew paste.',
      price: 480,
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['curries'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 1,
      prepTimeMinutes: 16,
      allergens: 'Dairy, Tree Nuts',
    },
    {
      name: 'Dal Makhani Bukhara',
      description: 'Signature black urad lentils slow-cooked for 18 hours on charcoal embers with butter, cream, and sun-dried fenugreek leaves.',
      price: 360,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['curries'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 1,
      prepTimeMinutes: 15,
      allergens: 'Dairy',
    },
    {
      name: 'Paneer Butter Masala',
      description: 'Fresh malai paneer cubes gently cooked in a creamy spiced tomato gravy with crushed kasuri methi and fresh cream.',
      price: 390,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['curries'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 1,
      prepTimeMinutes: 14,
      allergens: 'Dairy, Tree Nuts',
    },
    {
      name: 'Awadhi Dum Chicken Biryani',
      description: 'Fragrant aged long-grain basmati rice layered with succulent chicken, saffron milk, fried onions, and rose water, sealed in handi.',
      price: 460,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['biryani'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 2,
      prepTimeMinutes: 18,
      allergens: 'Dairy',
    },
    {
      name: 'Shahi Subz Dum Biryani',
      description: 'Handi-cooked basmati rice with farm-fresh beans, carrots, cauliflower, paneer, and cashews infused with cardamom and saffron.',
      price: 380,
      imageUrl: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['biryani'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 1,
      prepTimeMinutes: 16,
      allergens: 'Dairy, Tree Nuts',
    },
    {
      name: 'Butter Garlic Naan',
      description: 'Clay tandoor blistered leavened bread generously brushed with minced roasted garlic, butter, and fresh coriander.',
      price: 85,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['breads'],
      isVeg: true,
      isGlutenFree: false,
      spiceLevel: 0,
      prepTimeMinutes: 5,
      allergens: 'Dairy, Gluten',
    },
    {
      name: 'Kesari Mango Lassi',
      description: 'Velvety sweet curd churned with Ratnagiri Alphonso mango pulp, saffron strands, and crushed pistachios.',
      price: 160,
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['beverages'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 0,
      prepTimeMinutes: 4,
      allergens: 'Dairy, Tree Nuts',
    },
    {
      name: 'Gulab Jamun with Kesari Rabdi',
      description: 'Two golden khoya dumplings steeped in rose cardamom syrup, served over slow-reduced saffron malai rabdi.',
      price: 190,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['desserts'],
      isVeg: true,
      isGlutenFree: false,
      spiceLevel: 0,
      prepTimeMinutes: 6,
      allergens: 'Dairy, Gluten, Tree Nuts',
    },
    {
      name: 'Royal Shahi Rasmalai',
      description: 'Soft cottage cheese discs soaked in chilled clotted saffron cream milk garnished with sliced almonds and pistachios.',
      price: 210,
      imageUrl: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=800&q=80',
      categoryId: rasoiCatMap['desserts'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 0,
      prepTimeMinutes: 5,
      allergens: 'Dairy, Tree Nuts',
    },
  ];
  const createdRasoiItems = [];
  for (const item of rasoiItems) {
    const mi = await prisma.menuItem.create({ data: { ...item, restaurantId: royalRasoi.id } });
    createdRasoiItems.push(mi);
  }

  // KDS Orders for Royal Rasoi
  await prisma.order.create({
    data: {
      orderNumber: 'ORD-1082',
      type: 'DINE_IN',
      status: 'PREPARING',
      paymentStatus: 'PAID',
      tableId: rasoiTables[1].id,
      totalAmount: 966,
      taxAmount: 46,
      guestNotes: 'Make Butter Chicken extra creamy, less spicy for kids!',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98101 23456',
      estimatedMinutes: 20,
      restaurantId: royalRasoi.id,
      items: {
        create: [
          { menuItemId: createdRasoiItems[3].id, quantity: 1, unitPrice: 480, subtotal: 480 },
          { menuItemId: createdRasoiItems[4].id, quantity: 1, unitPrice: 360, subtotal: 360 },
          { menuItemId: createdRasoiItems[8].id, quantity: 2, unitPrice: 85, subtotal: 170 },
        ],
      },
    },
  });

  // Inventory for Royal Rasoi
  const rasoiInventory = [
    { name: 'Fresh Malai Paneer', currentStock: 8.5, minThreshold: 15.0, unit: 'kg', costPerUnit: 340, reorderPredictedDays: 1 },
    { name: 'Amul Butter & Dairy Cream', currentStock: 12.0, minThreshold: 20.0, unit: 'kg', costPerUnit: 280, reorderPredictedDays: 1 },
    { name: 'Kohinoor Aged Basmati Rice', currentStock: 35.0, minThreshold: 15.0, unit: 'kg', costPerUnit: 140, reorderPredictedDays: 5 },
    { name: 'Pure Desi Cow Ghee', currentStock: 6.0, minThreshold: 10.0, unit: 'liters', costPerUnit: 650, reorderPredictedDays: 2 },
  ];
  for (const inv of rasoiInventory) {
    await prisma.inventoryItem.create({ data: { ...inv, restaurantId: royalRasoi.id } });
  }

  // =========================================================================
  // 2. RESTAURANT 2: DAKSHIN COASTAL KITCHEN (South Indian & Coastal Seafood)
  // =========================================================================
  const dakshin = await prisma.restaurant.create({
    data: {
      name: 'Dakshin Coastal Kitchen',
      slug: 'dakshin-coastal-kitchen',
      address: '100ft Road, Indiranagar, Bengaluru, Karnataka',
      phone: '+91 (80) 4122-8900',
      currency: 'INR',
      taxRate: 5.0,
    },
  });
  console.log('✅ Created Restaurant 2:', dakshin.name);

  // Tables for Dakshin Coastal
  const dakshinTableData = [
    { number: 'D-01', capacity: 2, section: 'Backwater Deck', status: 'FREE' },
    { number: 'D-02', capacity: 4, section: 'Backwater Deck', status: 'OCCUPIED' },
    { number: 'D-03', capacity: 4, section: 'Coromandel Verandah', status: 'FREE' },
    { number: 'D-04', capacity: 6, section: 'Coromandel Verandah', status: 'RESERVED' },
    { number: 'D-05', capacity: 4, section: 'Marina Lounge', status: 'FREE' },
    { number: 'D-06', capacity: 8, section: 'Chettinad Private Dining', status: 'FREE' },
  ];
  const dakshinTables = [];
  for (const t of dakshinTableData) {
    const tbl = await prisma.table.create({
      data: { ...t, restaurantId: dakshin.id, qrCodeUrl: `http://localhost:3000/?restaurant=dakshin-coastal-kitchen&table=${t.number}` },
    });
    dakshinTables.push(tbl);
  }

  // Categories for Dakshin Coastal
  const dakshinCategories = [
    { name: 'Coastal Starters & Roasts', slug: 'starters', sortOrder: 1 },
    { name: 'Curries, Meen & Gravies', slug: 'curries', sortOrder: 2 },
    { name: 'Appam, Parotta & Biryani', slug: 'breads', sortOrder: 3 },
    { name: 'Traditional Kaapi & Mithai', slug: 'beverages', sortOrder: 4 },
  ];
  const dakshinCatMap = {};
  for (const c of dakshinCategories) {
    const cat = await prisma.category.create({ data: { ...c, restaurantId: dakshin.id } });
    dakshinCatMap[c.slug] = cat.id;
  }

  // Menu items for Dakshin Coastal
  const dakshinItems = [
    {
      name: 'Ghee Podi Tossed Idlis',
      description: 'Steamed baby button idlis tossed in roasted lentil gunpowder podi and sizzling hot aromatic desi ghee.',
      price: 190,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['starters'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 2,
      prepTimeMinutes: 8,
      allergens: 'Dairy',
    },
    {
      name: 'Kozhi 65 Crisp Chicken',
      description: 'Tender chicken bites tossed with fresh curry leaves, crushed Byadgi chilies, ginger, and lemon zest.',
      price: 360,
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['starters'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 3,
      prepTimeMinutes: 12,
      allergens: 'None',
    },
    {
      name: 'Karavali Butter Garlic Prawns',
      description: 'Fresh Arab Sea prawns flash-sautéed in browned garlic cloves, fresh curry leaves, and sour kokum butter.',
      price: 480,
      imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['starters'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 2,
      prepTimeMinutes: 14,
      allergens: 'Shellfish, Dairy',
    },
    {
      name: 'Kerala Meen Pollichathu',
      description: 'Fresh pearl spot sea fish coated in spicy shallot-tomato masala, wrapped in tender banana leaf and slow-griddled.',
      price: 520,
      imageUrl: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['curries'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 3,
      prepTimeMinutes: 18,
      allergens: 'Fish',
    },
    {
      name: 'Chettinad Pepper Chicken Gravy',
      description: 'Traditional country chicken cooked with hand-pounded Tellicherry black pepper, star anise, and toasted coconut paste.',
      price: 450,
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['curries'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 3,
      prepTimeMinutes: 16,
      allergens: 'None',
    },
    {
      name: 'Alleppey Raw Mango Fish Curry',
      description: 'Tender fish fillets simmered in raw green mango gravy, thick coconut cream, and tempered mustard seeds.',
      price: 510,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['curries'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 2,
      prepTimeMinutes: 15,
      allergens: 'Fish',
    },
    {
      name: 'Fluffy Malabar Parotta (2 Pcs)',
      description: 'Signature flaky, layered and spiraled Kerala flatbread griddled to golden crispy perfection with ghee.',
      price: 95,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['breads'],
      isVeg: true,
      isGlutenFree: false,
      spiceLevel: 0,
      prepTimeMinutes: 5,
      allergens: 'Gluten, Dairy',
    },
    {
      name: 'Appam with Sweet Coconut Milk (2 Pcs)',
      description: 'Crisp lacy-edged fermented rice and coconut hoppers with soft pillowy spongy centers.',
      price: 110,
      imageUrl: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['breads'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 0,
      prepTimeMinutes: 6,
      allergens: 'None',
    },
    {
      name: 'Thalassery Chicken Dum Biryani',
      description: 'Authentic Malabar coastal biryani prepared with fragrant short-grain Kaima rice, fried cashew nuts, and golden raisins.',
      price: 440,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['breads'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 2,
      prepTimeMinutes: 16,
      allergens: 'Tree Nuts, Dairy',
    },
    {
      name: 'Madras Degree Filter Kaapi',
      description: 'Authentic South Indian chicory blend coffee frothed by meter-pour into a brass dabarah and tumbler set.',
      price: 85,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['beverages'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 0,
      prepTimeMinutes: 4,
      allergens: 'Dairy',
    },
    {
      name: 'Elaneer Tender Coconut Payasam',
      description: 'Luscious chilled pudding prepared with tender coconut malai pulp, fresh coconut milk, and crushed green cardamom.',
      price: 190,
      imageUrl: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=800&q=80',
      categoryId: dakshinCatMap['beverages'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 0,
      prepTimeMinutes: 4,
      allergens: 'Dairy',
    },
  ];
  const createdDakshinItems = [];
  for (const item of dakshinItems) {
    const mi = await prisma.menuItem.create({ data: { ...item, restaurantId: dakshin.id } });
    createdDakshinItems.push(mi);
  }

  // Active KDS Order for Dakshin Coastal
  await prisma.order.create({
    data: {
      orderNumber: 'ORD-2041',
      type: 'DINE_IN',
      status: 'PLACED',
      paymentStatus: 'PAID',
      tableId: dakshinTables[1].id,
      totalAmount: 746,
      taxAmount: 36,
      guestNotes: 'Extra coconut milk with Appam please!',
      customerName: 'Kavitha Swaminathan',
      customerPhone: '+91 94440 88776',
      estimatedMinutes: 18,
      restaurantId: dakshin.id,
      items: {
        create: [
          { menuItemId: createdDakshinItems[3].id, quantity: 1, unitPrice: 520, subtotal: 520 }, // Meen Pollichathu
          { menuItemId: createdDakshinItems[6].id, quantity: 2, unitPrice: 95, subtotal: 190 }, // Malabar Parotta
        ],
      },
    },
  });

  // =========================================================================
  // 3. RESTAURANT 3: PESHAWARI DARBAR & TANDOOR (Frontier Clay-Oven & Handi)
  // =========================================================================
  const peshawari = await prisma.restaurant.create({
    data: {
      name: 'Peshawari Darbar & Tandoor',
      slug: 'peshawari-darbar',
      address: 'Near Gateway of India, Colaba Causeway, South Mumbai',
      phone: '+91 (22) 2284-5500',
      currency: 'INR',
      taxRate: 5.0,
    },
  });
  console.log('✅ Created Restaurant 3:', peshawari.name);

  // Tables for Peshawari Darbar
  const peshawariTableData = [
    { number: 'P-01', capacity: 2, section: 'Khyber Diwan', status: 'FREE' },
    { number: 'P-02', capacity: 4, section: 'Khyber Diwan', status: 'OCCUPIED' },
    { number: 'P-03', capacity: 4, section: 'Frontier Courtyard', status: 'FREE' },
    { number: 'P-04', capacity: 6, section: 'Frontier Courtyard', status: 'RESERVED' },
    { number: 'P-05', capacity: 8, section: 'Royal Baithak Suite', status: 'FREE' },
  ];
  const peshawariTables = [];
  for (const t of peshawariTableData) {
    const tbl = await prisma.table.create({
      data: { ...t, restaurantId: peshawari.id, qrCodeUrl: `http://localhost:3000/?restaurant=peshawari-darbar&table=${t.number}` },
    });
    peshawariTables.push(tbl);
  }

  // Categories for Peshawari Darbar
  const peshawariCategories = [
    { name: 'Frontier Clay-Oven Kebabs & Tikkas', slug: 'kebabs', sortOrder: 1 },
    { name: 'Slow-Simmered Handi Curries', slug: 'curries', sortOrder: 2 },
    { name: 'Artisanal Breads & Pulao', slug: 'breads', sortOrder: 3 },
    { name: 'Darbar Mithai & Sharbath', slug: 'desserts', sortOrder: 4 },
  ];
  const peshawariCatMap = {};
  for (const c of peshawariCategories) {
    const cat = await prisma.category.create({ data: { ...c, restaurantId: peshawari.id } });
    peshawariCatMap[c.slug] = cat.id;
  }

  // Menu items for Peshawari Darbar
  const peshawariItems = [
    {
      name: 'Peshawari Chapli Kebab',
      description: 'Rustic minced mutton patties kneaded with crushed coriander seeds, pomegranate seeds (anardana), tomatoes, and griddled in pure ghee.',
      price: 440,
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
      categoryId: peshawariCatMap['kebabs'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 3,
      prepTimeMinutes: 15,
      allergens: 'Dairy',
    },
    {
      name: 'Kakori Silken Kebab',
      description: 'The world-famous melt-in-mouth mutton seekh kebab infused with royal saffron, rose petal water, and cloves.',
      price: 460,
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
      categoryId: peshawariCatMap['kebabs'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 2,
      prepTimeMinutes: 14,
      allergens: 'None',
    },
    {
      name: 'Peshawari Bharwan Paneer',
      description: 'Thick slabs of fresh cottage cheese stuffed with spiced dry fruits and mint paste, roasted over charcoal coals.',
      price: 360,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
      categoryId: peshawariCatMap['kebabs'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 2,
      prepTimeMinutes: 12,
      allergens: 'Dairy, Tree Nuts',
    },
    {
      name: 'Dal Peshawari (Simmered 24 Hours)',
      description: 'Black lentils slow-cooked overnight with ripe tomatoes, white churned butter, and mild Kashmiri spices in a clay pot.',
      price: 380,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      categoryId: peshawariCatMap['curries'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 1,
      prepTimeMinutes: 15,
      allergens: 'Dairy',
    },
    {
      name: 'Nalli Nihari Gosht',
      description: 'Royal slow-braised mutton shanks with marrow bone in a rich, velvety aromatic stew seasoned with dry ginger and pipli long pepper.',
      price: 560,
      imageUrl: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80',
      categoryId: peshawariCatMap['curries'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 3,
      prepTimeMinutes: 20,
      allergens: 'None',
    },
    {
      name: 'Peshawari Murgh Karahi',
      description: 'Chicken pieces stir-cooked in an iron karahi with juicy vine tomatoes, ginger juliennes, green chilies, and freshly roasted black pepper.',
      price: 470,
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
      categoryId: peshawariCatMap['curries'],
      isVeg: false,
      isGlutenFree: true,
      spiceLevel: 3,
      prepTimeMinutes: 16,
      allergens: 'None',
    },
    {
      name: 'Sheermal Royal Saffron Flatbread',
      description: 'Traditional mildly sweet leavened bread kneaded with warm milk, saffron, and brushed with pure desi ghee.',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      categoryId: peshawariCatMap['breads'],
      isVeg: true,
      isGlutenFree: false,
      spiceLevel: 0,
      prepTimeMinutes: 6,
      allergens: 'Dairy, Gluten',
    },
    {
      name: 'Taftan Fluffy Bread',
      description: 'Delicate Persian-influenced tandoori bread flavored with saffron, green cardamom powder, and white sesame seeds.',
      price: 110,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      categoryId: peshawariCatMap['breads'],
      isVeg: true,
      isGlutenFree: false,
      spiceLevel: 0,
      prepTimeMinutes: 5,
      allergens: 'Dairy, Gluten, Sesame',
    },
    {
      name: 'Zafrani Matka Phirni',
      description: 'Chilled slow-ground basmati rice pudding infused with pure saffron and kewra water, served in unglazed earthenware pots.',
      price: 190,
      imageUrl: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=800&q=80',
      categoryId: peshawariCatMap['desserts'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 0,
      prepTimeMinutes: 5,
      allergens: 'Dairy, Tree Nuts',
    },
    {
      name: 'Rooh Afza Gulkand Sharbath',
      description: 'Chilled Damascus rose cooler with basil sabja seeds, damask rose petal jam, and crushed mountain ice.',
      price: 130,
      imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
      categoryId: peshawariCatMap['desserts'],
      isVeg: true,
      isGlutenFree: true,
      spiceLevel: 0,
      prepTimeMinutes: 3,
      allergens: 'None',
    },
  ];
  const createdPeshawariItems = [];
  for (const item of peshawariItems) {
    const mi = await prisma.menuItem.create({ data: { ...item, restaurantId: peshawari.id } });
    createdPeshawariItems.push(mi);
  }

  // Active KDS Order for Peshawari
  await prisma.order.create({
    data: {
      orderNumber: 'ORD-3055',
      type: 'DINE_IN',
      status: 'PREPARING',
      paymentStatus: 'PAID',
      tableId: peshawariTables[1].id,
      totalAmount: 1050,
      taxAmount: 50,
      guestNotes: 'Extra spicy Karahi please!',
      customerName: 'Zainab Merchant',
      customerPhone: '+91 98200 11223',
      estimatedMinutes: 20,
      restaurantId: peshawari.id,
      items: {
        create: [
          { menuItemId: createdPeshawariItems[0].id, quantity: 1, unitPrice: 440, subtotal: 440 }, // Chapli Kebab
          { menuItemId: createdPeshawariItems[5].id, quantity: 1, unitPrice: 470, subtotal: 470 }, // Murgh Karahi
          { menuItemId: createdPeshawariItems[6].id, quantity: 2, unitPrice: 120, subtotal: 240 }, // Sheermal
        ],
      },
    },
  });

  console.log('\n🎉 DineDesk Multi-Tenant Database Seeding Completed Successfully!');
  console.log('✨ 3 Authentic Indian Restaurants Seeded:');
  console.log('   1. The Royal Rasoi Grand Bistro (Delhi) - [the-royal-rasoi]');
  console.log('   2. Dakshin Coastal Kitchen (Bengaluru) - [dakshin-coastal-kitchen]');
  console.log('   3. Peshawari Darbar & Tandoor (Mumbai) - [peshawari-darbar]\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
