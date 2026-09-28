export const initialData = {
  "restaurants": [
    {
      "id": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
      "name": "The Royal Rasoi Grand Bistro",
      "slug": "the-royal-rasoi",
      "address": "Plot 12, Connaught Circus, Central Delhi",
      "phone": "+91 (11) 4890-2100",
      "currency": "INR",
      "taxRate": 5,
      "createdAt": "2026-09-24T07:04:53.257Z",
      "updatedAt": "2026-09-24T07:04:53.257Z",
      "categories": [
        {
          "id": "b818682c-f7b0-4111-ba76-0fd938c2a329",
          "name": "Tandoori Kebabs & Starters",
          "slug": "starters",
          "sortOrder": 1,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "menuItems": [
            {
              "id": "83adf8b6-808a-48b2-aaa4-2d07ea4ee980",
              "name": "Paneer Tikka Angara",
              "description": "Charcoal-grilled cottage cheese cubes marinated in Kashmiri chili, hung yogurt, mustard oil, and bell peppers.",
              "price": 340,
              "imageUrl": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
              "categoryId": "b818682c-f7b0-4111-ba76-0fd938c2a329",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 2,
              "prepTimeMinutes": 12,
              "allergens": "Dairy",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            },
            {
              "id": "ebd18a1a-5114-415a-a769-1a8f7bfb12d1",
              "name": "Galouti Kebab Nawabi",
              "description": "Melt-in-mouth minced mutton patties infused with raw papaya, kewra essence, and 32 aromatic Awadhi spices.",
              "price": 450,
              "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
              "categoryId": "b818682c-f7b0-4111-ba76-0fd938c2a329",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 2,
              "prepTimeMinutes": 15,
              "allergens": "None",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            },
            {
              "id": "88004247-f700-4bc9-a491-7826e8da7dba",
              "name": "Dilli 6 Papdi Chaat",
              "description": "Crisp flour crackers layered with spiced potatoes, boiled chickpeas, whipped sweet yogurt, mint chutney, and tamarind saunth.",
              "price": 210,
              "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80",
              "categoryId": "b818682c-f7b0-4111-ba76-0fd938c2a329",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": false,
              "spiceLevel": 1,
              "prepTimeMinutes": 6,
              "allergens": "Dairy, Gluten",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            }
          ]
        },
        {
          "id": "2635c2ee-4350-452e-be6a-19cc5f136b3c",
          "name": "Shahi Curries & Gravies",
          "slug": "curries",
          "sortOrder": 2,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "menuItems": [
            {
              "id": "2ba2f770-fb1c-4657-9a0e-4d74a0f516c8",
              "name": "Murgh Makhani (Butter Chicken)",
              "description": "Tandoor-smoked pulled chicken simmered in rich velvety San Marzano tomato reduction, churned butter, and cashew paste.",
              "price": 480,
              "imageUrl": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
              "categoryId": "2635c2ee-4350-452e-be6a-19cc5f136b3c",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 1,
              "prepTimeMinutes": 16,
              "allergens": "Dairy, Tree Nuts",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            },
            {
              "id": "64bba3d9-de66-401f-be1f-0a7d131997b4",
              "name": "Dal Makhani Bukhara",
              "description": "Signature black urad lentils slow-cooked for 18 hours on charcoal embers with butter, cream, and sun-dried fenugreek leaves.",
              "price": 360,
              "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
              "categoryId": "2635c2ee-4350-452e-be6a-19cc5f136b3c",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 1,
              "prepTimeMinutes": 15,
              "allergens": "Dairy",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            },
            {
              "id": "04f5e3f9-9cfd-4258-9221-e11adb9f65d0",
              "name": "Paneer Butter Masala",
              "description": "Fresh malai paneer cubes gently cooked in a creamy spiced tomato gravy with crushed kasuri methi and fresh cream.",
              "price": 390,
              "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
              "categoryId": "2635c2ee-4350-452e-be6a-19cc5f136b3c",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 1,
              "prepTimeMinutes": 14,
              "allergens": "Dairy, Tree Nuts",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            }
          ]
        },
        {
          "id": "92506e63-d297-4cf5-ab09-87aa7b92de46",
          "name": "Dum Biryani & Pulao",
          "slug": "biryani",
          "sortOrder": 3,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "menuItems": [
            {
              "id": "09d3eb7f-9a52-4cf0-9de8-c501c8994a69",
              "name": "Awadhi Dum Chicken Biryani",
              "description": "Fragrant aged long-grain basmati rice layered with succulent chicken, saffron milk, fried onions, and rose water, sealed in handi.",
              "price": 460,
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
              "categoryId": "92506e63-d297-4cf5-ab09-87aa7b92de46",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 2,
              "prepTimeMinutes": 18,
              "allergens": "Dairy",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            },
            {
              "id": "d45fd587-473b-438e-9ef7-72596142fc30",
              "name": "Shahi Subz Dum Biryani",
              "description": "Handi-cooked basmati rice with farm-fresh beans, carrots, cauliflower, paneer, and cashews infused with cardamom and saffron.",
              "price": 380,
              "imageUrl": "https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=800&q=80",
              "categoryId": "92506e63-d297-4cf5-ab09-87aa7b92de46",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 1,
              "prepTimeMinutes": 16,
              "allergens": "Dairy, Tree Nuts",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            }
          ]
        },
        {
          "id": "c45a6589-dd2e-4649-96ef-7d9d39a5fbae",
          "name": "Tandoori Roti & Naan",
          "slug": "breads",
          "sortOrder": 4,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "menuItems": [
            {
              "id": "461cabbf-4836-4902-8a25-688ce3987804",
              "name": "Butter Garlic Naan",
              "description": "Clay tandoor blistered leavened bread generously brushed with minced roasted garlic, butter, and fresh coriander.",
              "price": 85,
              "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
              "categoryId": "c45a6589-dd2e-4649-96ef-7d9d39a5fbae",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": false,
              "spiceLevel": 0,
              "prepTimeMinutes": 5,
              "allergens": "Dairy, Gluten",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            }
          ]
        },
        {
          "id": "cc6a0711-ba0b-4c7b-9830-7d87a62175a5",
          "name": "Lassi, Mocktails & Chai",
          "slug": "beverages",
          "sortOrder": 5,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "menuItems": [
            {
              "id": "2dd3a1e8-1810-4feb-a75e-a8fb9c7986ae",
              "name": "Kesari Mango Lassi",
              "description": "Velvety sweet curd churned with Ratnagiri Alphonso mango pulp, saffron strands, and crushed pistachios.",
              "price": 160,
              "imageUrl": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
              "categoryId": "cc6a0711-ba0b-4c7b-9830-7d87a62175a5",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 0,
              "prepTimeMinutes": 4,
              "allergens": "Dairy, Tree Nuts",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            }
          ]
        },
        {
          "id": "b22cd7d2-0dd5-4de1-943a-85eac895c19a",
          "name": "Desi Mithai & Desserts",
          "slug": "desserts",
          "sortOrder": 6,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "menuItems": [
            {
              "id": "3c261418-7fa3-4ea5-881d-6451a8b4590c",
              "name": "Gulab Jamun with Kesari Rabdi",
              "description": "Two golden khoya dumplings steeped in rose cardamom syrup, served over slow-reduced saffron malai rabdi.",
              "price": 190,
              "imageUrl": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
              "categoryId": "b22cd7d2-0dd5-4de1-943a-85eac895c19a",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": false,
              "spiceLevel": 0,
              "prepTimeMinutes": 6,
              "allergens": "Dairy, Gluten, Tree Nuts",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            },
            {
              "id": "8827129d-6b12-4620-8edf-e2585e6f2381",
              "name": "Royal Shahi Rasmalai",
              "description": "Soft cottage cheese discs soaked in chilled clotted saffron cream milk garnished with sliced almonds and pistachios.",
              "price": 210,
              "imageUrl": "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=800&q=80",
              "categoryId": "b22cd7d2-0dd5-4de1-943a-85eac895c19a",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 0,
              "prepTimeMinutes": 5,
              "allergens": "Dairy, Tree Nuts",
              "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
            }
          ]
        }
      ],
      "tables": [
        {
          "id": "05fd830a-ab01-4a14-a8a5-7e784163d641",
          "number": "T-01",
          "capacity": 2,
          "section": "Royal Haveli Hall",
          "status": "OCCUPIED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-01",
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        },
        {
          "id": "23738471-6a89-4bc0-b8d9-eecd3157ef3d",
          "number": "T-02",
          "capacity": 4,
          "section": "Royal Haveli Hall",
          "status": "OCCUPIED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-02",
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        },
        {
          "id": "6b1ac2ab-95bc-4055-9940-9295d92dd928",
          "number": "T-03",
          "capacity": 4,
          "section": "Royal Haveli Hall",
          "status": "RESERVED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-03",
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        },
        {
          "id": "1e6e02e0-1e74-42a7-965a-60557174fbc2",
          "number": "T-04",
          "capacity": 6,
          "section": "Royal Haveli Hall",
          "status": "OCCUPIED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-04",
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        },
        {
          "id": "88b49877-6413-419a-9b31-ee48b73d1c37",
          "number": "T-05",
          "capacity": 2,
          "section": "Mughal Courtyard (Outdoor)",
          "status": "RESERVED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-05",
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        },
        {
          "id": "a35b691a-5509-493d-934f-c67dad6ac774",
          "number": "T-06",
          "capacity": 4,
          "section": "Mughal Courtyard (Outdoor)",
          "status": "CLEANING",
          "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-06",
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        },
        {
          "id": "c0fcb1e7-fc33-42d2-b14c-88801c045411",
          "number": "T-07",
          "capacity": 4,
          "section": "Mughal Courtyard (Outdoor)",
          "status": "RESERVED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-07",
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        },
        {
          "id": "bdf1c30d-4166-4266-81be-8cb34981b280",
          "number": "T-08",
          "capacity": 8,
          "section": "Sheesh Mahal (VIP Lounge)",
          "status": "RESERVED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-08",
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        }
      ],
      "happyHourRules": [],
      "inventory": [
        {
          "id": "7085f094-b8f7-4f79-a97b-b8a899e763d5",
          "name": "Fresh Malai Paneer",
          "currentStock": 8.5,
          "minThreshold": 15,
          "unit": "kg",
          "costPerUnit": 340,
          "reorderPredictedDays": 1,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        },
        {
          "id": "4df0718c-fbb5-4c52-bc35-371c8641002c",
          "name": "Amul Butter & Dairy Cream",
          "currentStock": 12,
          "minThreshold": 20,
          "unit": "kg",
          "costPerUnit": 280,
          "reorderPredictedDays": 1,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        },
        {
          "id": "97d9587a-8437-4a80-9d78-72227c2b2507",
          "name": "Kohinoor Aged Basmati Rice",
          "currentStock": 35,
          "minThreshold": 15,
          "unit": "kg",
          "costPerUnit": 140,
          "reorderPredictedDays": 5,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        },
        {
          "id": "0d6b69b4-88b6-4442-a6bf-e0b23b1a7913",
          "name": "Pure Desi Cow Ghee",
          "currentStock": 6,
          "minThreshold": 10,
          "unit": "liters",
          "costPerUnit": 650,
          "reorderPredictedDays": 2,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
        }
      ],
      "users": [
        {
          "id": "b92b659b-e171-4488-9a7e-96d866a4e96a",
          "name": "Aarav Sharma (Customer)",
          "email": "customer@dinedesk.com",
          "password": "password123",
          "role": "CUSTOMER",
          "phone": null,
          "loyaltyPoints": 250,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "createdAt": "2026-09-24T07:04:53.266Z"
        },
        {
          "id": "5aa1d845-8323-4690-886b-61c91dd1e7ef",
          "name": "Rajesh Kumar (Senior Captain)",
          "email": "waiter@dinedesk.com",
          "password": "password123",
          "role": "WAITER",
          "phone": null,
          "loyaltyPoints": 150,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "createdAt": "2026-09-24T07:04:53.274Z"
        },
        {
          "id": "5a9fba5f-4592-473a-8fbb-4d8aacff64c1",
          "name": "Ustad Imtiaz Khan (Head Chef)",
          "email": "kitchen@dinedesk.com",
          "password": "password123",
          "role": "KITCHEN",
          "phone": null,
          "loyaltyPoints": 150,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "createdAt": "2026-09-24T07:04:53.283Z"
        },
        {
          "id": "9a242aaf-e980-480b-8c07-9b77b2a21bf9",
          "name": "Priya Mehra (General Manager)",
          "email": "admin@dinedesk.com",
          "password": "password123",
          "role": "ADMIN",
          "phone": null,
          "loyaltyPoints": 150,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "createdAt": "2026-09-24T07:04:53.292Z"
        },
        {
          "id": "a4e56c5a-c672-43c4-bbe3-308ede49385c",
          "name": "Vikramaditya (Platform SuperAdmin)",
          "email": "superadmin@dinedesk.com",
          "password": "password123",
          "role": "SUPERADMIN",
          "phone": null,
          "loyaltyPoints": 150,
          "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
          "createdAt": "2026-09-24T07:04:53.301Z"
        }
      ]
    },
    {
      "id": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0",
      "name": "Dakshin Coastal Kitchen",
      "slug": "dakshin-coastal-kitchen",
      "address": "100ft Road, Indiranagar, Bengaluru, Karnataka",
      "phone": "+91 (80) 4122-8900",
      "currency": "INR",
      "taxRate": 5,
      "createdAt": "2026-09-24T07:04:53.544Z",
      "updatedAt": "2026-09-24T07:04:53.544Z",
      "categories": [
        {
          "id": "6a8c87ec-06fc-42d8-8097-58b0fd891872",
          "name": "Coastal Starters & Roasts",
          "slug": "starters",
          "sortOrder": 1,
          "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0",
          "menuItems": [
            {
              "id": "6d7c0a90-96d9-4ece-9b21-2546b5b84687",
              "name": "Ghee Podi Tossed Idlis",
              "description": "Steamed baby button idlis tossed in roasted lentil gunpowder podi and sizzling hot aromatic desi ghee.",
              "price": 190,
              "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
              "categoryId": "6a8c87ec-06fc-42d8-8097-58b0fd891872",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 2,
              "prepTimeMinutes": 8,
              "allergens": "Dairy",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            },
            {
              "id": "e1514c62-1821-43c7-91df-05d48c296e5e",
              "name": "Kozhi 65 Crisp Chicken",
              "description": "Tender chicken bites tossed with fresh curry leaves, crushed Byadgi chilies, ginger, and lemon zest.",
              "price": 360,
              "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
              "categoryId": "6a8c87ec-06fc-42d8-8097-58b0fd891872",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 3,
              "prepTimeMinutes": 12,
              "allergens": "None",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            },
            {
              "id": "221dec86-8153-44bd-a3ef-418c0229a5e0",
              "name": "Karavali Butter Garlic Prawns",
              "description": "Fresh Arab Sea prawns flash-sautéed in browned garlic cloves, fresh curry leaves, and sour kokum butter.",
              "price": 480,
              "imageUrl": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
              "categoryId": "6a8c87ec-06fc-42d8-8097-58b0fd891872",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 2,
              "prepTimeMinutes": 14,
              "allergens": "Shellfish, Dairy",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            }
          ]
        },
        {
          "id": "e992312c-2982-434e-a709-4edd70febef8",
          "name": "Curries, Meen & Gravies",
          "slug": "curries",
          "sortOrder": 2,
          "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0",
          "menuItems": [
            {
              "id": "7280336e-d642-489f-a936-d5be6e273ad2",
              "name": "Kerala Meen Pollichathu",
              "description": "Fresh pearl spot sea fish coated in spicy shallot-tomato masala, wrapped in tender banana leaf and slow-griddled.",
              "price": 520,
              "imageUrl": "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80",
              "categoryId": "e992312c-2982-434e-a709-4edd70febef8",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 3,
              "prepTimeMinutes": 18,
              "allergens": "Fish",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            },
            {
              "id": "e77ba0f7-cff9-499e-8ac7-34ff35320840",
              "name": "Chettinad Pepper Chicken Gravy",
              "description": "Traditional country chicken cooked with hand-pounded Tellicherry black pepper, star anise, and toasted coconut paste.",
              "price": 450,
              "imageUrl": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
              "categoryId": "e992312c-2982-434e-a709-4edd70febef8",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 3,
              "prepTimeMinutes": 16,
              "allergens": "None",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            },
            {
              "id": "699f4ea4-dce7-4dec-bd82-d9b2b460ad56",
              "name": "Alleppey Raw Mango Fish Curry",
              "description": "Tender fish fillets simmered in raw green mango gravy, thick coconut cream, and tempered mustard seeds.",
              "price": 510,
              "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
              "categoryId": "e992312c-2982-434e-a709-4edd70febef8",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 2,
              "prepTimeMinutes": 15,
              "allergens": "Fish",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            }
          ]
        },
        {
          "id": "bf2b7fd1-7728-4aaf-82f7-25ad70dcd537",
          "name": "Appam, Parotta & Biryani",
          "slug": "breads",
          "sortOrder": 3,
          "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0",
          "menuItems": [
            {
              "id": "46b927f2-1b48-4abb-bd95-10cb24e501b3",
              "name": "Fluffy Malabar Parotta (2 Pcs)",
              "description": "Signature flaky, layered and spiraled Kerala flatbread griddled to golden crispy perfection with ghee.",
              "price": 95,
              "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
              "categoryId": "bf2b7fd1-7728-4aaf-82f7-25ad70dcd537",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": false,
              "spiceLevel": 0,
              "prepTimeMinutes": 5,
              "allergens": "Gluten, Dairy",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            },
            {
              "id": "c549dbfe-ae3e-4796-9311-dd62f139cc5f",
              "name": "Appam with Sweet Coconut Milk (2 Pcs)",
              "description": "Crisp lacy-edged fermented rice and coconut hoppers with soft pillowy spongy centers.",
              "price": 110,
              "imageUrl": "https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=800&q=80",
              "categoryId": "bf2b7fd1-7728-4aaf-82f7-25ad70dcd537",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 0,
              "prepTimeMinutes": 6,
              "allergens": "None",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            },
            {
              "id": "65af0ef2-4a6e-40b5-8304-fa1a6a383c93",
              "name": "Thalassery Chicken Dum Biryani",
              "description": "Authentic Malabar coastal biryani prepared with fragrant short-grain Kaima rice, fried cashew nuts, and golden raisins.",
              "price": 440,
              "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
              "categoryId": "bf2b7fd1-7728-4aaf-82f7-25ad70dcd537",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 2,
              "prepTimeMinutes": 16,
              "allergens": "Tree Nuts, Dairy",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            }
          ]
        },
        {
          "id": "8bdc331e-f298-440f-a24a-7a338eaf1fc3",
          "name": "Traditional Kaapi & Mithai",
          "slug": "beverages",
          "sortOrder": 4,
          "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0",
          "menuItems": [
            {
              "id": "60b37015-e0d9-406b-8423-2879f828b3fe",
              "name": "Madras Degree Filter Kaapi",
              "description": "Authentic South Indian chicory blend coffee frothed by meter-pour into a brass dabarah and tumbler set.",
              "price": 85,
              "imageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
              "categoryId": "8bdc331e-f298-440f-a24a-7a338eaf1fc3",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 0,
              "prepTimeMinutes": 4,
              "allergens": "Dairy",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            },
            {
              "id": "457ecd9a-328f-4b80-808b-47e63c360108",
              "name": "Elaneer Tender Coconut Payasam",
              "description": "Luscious chilled pudding prepared with tender coconut malai pulp, fresh coconut milk, and crushed green cardamom.",
              "price": 190,
              "imageUrl": "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=800&q=80",
              "categoryId": "8bdc331e-f298-440f-a24a-7a338eaf1fc3",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 0,
              "prepTimeMinutes": 4,
              "allergens": "Dairy",
              "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
            }
          ]
        }
      ],
      "tables": [
        {
          "id": "88c822c2-8a9c-4986-a19d-21814070d78f",
          "number": "D-01",
          "capacity": 2,
          "section": "Backwater Deck",
          "status": "OCCUPIED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=dakshin-coastal-kitchen&table=D-01",
          "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
        },
        {
          "id": "43cea1f4-a699-4b85-9ef9-0fb952fbe366",
          "number": "D-02",
          "capacity": 4,
          "section": "Backwater Deck",
          "status": "OCCUPIED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=dakshin-coastal-kitchen&table=D-02",
          "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
        },
        {
          "id": "517435cc-2b0b-4531-876f-f1fc12783e8b",
          "number": "D-03",
          "capacity": 4,
          "section": "Coromandel Verandah",
          "status": "FREE",
          "qrCodeUrl": "http://localhost:3000/?restaurant=dakshin-coastal-kitchen&table=D-03",
          "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
        },
        {
          "id": "61275c44-7a11-4cf2-b278-3f32e1c316d9",
          "number": "D-04",
          "capacity": 6,
          "section": "Coromandel Verandah",
          "status": "RESERVED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=dakshin-coastal-kitchen&table=D-04",
          "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
        },
        {
          "id": "faebb430-0339-45bf-9c31-7cacffa13bb6",
          "number": "D-05",
          "capacity": 4,
          "section": "Marina Lounge",
          "status": "FREE",
          "qrCodeUrl": "http://localhost:3000/?restaurant=dakshin-coastal-kitchen&table=D-05",
          "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
        },
        {
          "id": "f77e5cbe-e3a2-4e1c-bc86-afa6a65b2d30",
          "number": "D-06",
          "capacity": 8,
          "section": "Chettinad Private Dining",
          "status": "FREE",
          "qrCodeUrl": "http://localhost:3000/?restaurant=dakshin-coastal-kitchen&table=D-06",
          "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
        }
      ],
      "happyHourRules": [],
      "inventory": [],
      "users": []
    },
    {
      "id": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb",
      "name": "Peshawari Darbar & Tandoor",
      "slug": "peshawari-darbar",
      "address": "Near Gateway of India, Colaba Causeway, South Mumbai",
      "phone": "+91 (22) 2284-5500",
      "currency": "INR",
      "taxRate": 5,
      "createdAt": "2026-09-24T07:04:53.720Z",
      "updatedAt": "2026-09-24T07:04:53.720Z",
      "categories": [
        {
          "id": "a9bbbc6e-edd3-4eb7-8c4f-6e7d0fc4a570",
          "name": "Frontier Clay-Oven Kebabs & Tikkas",
          "slug": "kebabs",
          "sortOrder": 1,
          "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb",
          "menuItems": [
            {
              "id": "0cce81b4-3e09-45a9-81cb-696f555c5012",
              "name": "Peshawari Chapli Kebab",
              "description": "Rustic minced mutton patties kneaded with crushed coriander seeds, pomegranate seeds (anardana), tomatoes, and griddled in pure ghee.",
              "price": 440,
              "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
              "categoryId": "a9bbbc6e-edd3-4eb7-8c4f-6e7d0fc4a570",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 3,
              "prepTimeMinutes": 15,
              "allergens": "Dairy",
              "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
            },
            {
              "id": "1974a6e8-019d-4a3e-a703-a0895cb4ac3c",
              "name": "Kakori Silken Kebab",
              "description": "The world-famous melt-in-mouth mutton seekh kebab infused with royal saffron, rose petal water, and cloves.",
              "price": 460,
              "imageUrl": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
              "categoryId": "a9bbbc6e-edd3-4eb7-8c4f-6e7d0fc4a570",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 2,
              "prepTimeMinutes": 14,
              "allergens": "None",
              "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
            },
            {
              "id": "ede810c7-85b6-470e-b3d7-fd12ad71127f",
              "name": "Peshawari Bharwan Paneer",
              "description": "Thick slabs of fresh cottage cheese stuffed with spiced dry fruits and mint paste, roasted over charcoal coals.",
              "price": 360,
              "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
              "categoryId": "a9bbbc6e-edd3-4eb7-8c4f-6e7d0fc4a570",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 2,
              "prepTimeMinutes": 12,
              "allergens": "Dairy, Tree Nuts",
              "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
            }
          ]
        },
        {
          "id": "b34f4258-34e3-4ea0-81c6-c3f542bbb3f0",
          "name": "Slow-Simmered Handi Curries",
          "slug": "curries",
          "sortOrder": 2,
          "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb",
          "menuItems": [
            {
              "id": "0a30812c-f522-4d80-aa8e-ab6cb9427426",
              "name": "Dal Peshawari (Simmered 24 Hours)",
              "description": "Black lentils slow-cooked overnight with ripe tomatoes, white churned butter, and mild Kashmiri spices in a clay pot.",
              "price": 380,
              "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
              "categoryId": "b34f4258-34e3-4ea0-81c6-c3f542bbb3f0",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 1,
              "prepTimeMinutes": 15,
              "allergens": "Dairy",
              "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
            },
            {
              "id": "7ea8774f-7f13-48c8-8538-77b64c29fca1",
              "name": "Nalli Nihari Gosht",
              "description": "Royal slow-braised mutton shanks with marrow bone in a rich, velvety aromatic stew seasoned with dry ginger and pipli long pepper.",
              "price": 560,
              "imageUrl": "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80",
              "categoryId": "b34f4258-34e3-4ea0-81c6-c3f542bbb3f0",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 3,
              "prepTimeMinutes": 20,
              "allergens": "None",
              "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
            },
            {
              "id": "c3633cfb-c730-490c-ac7d-e4fb42033545",
              "name": "Peshawari Murgh Karahi",
              "description": "Chicken pieces stir-cooked in an iron karahi with juicy vine tomatoes, ginger juliennes, green chilies, and freshly roasted black pepper.",
              "price": 470,
              "imageUrl": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
              "categoryId": "b34f4258-34e3-4ea0-81c6-c3f542bbb3f0",
              "isAvailable": true,
              "isVeg": false,
              "isGlutenFree": true,
              "spiceLevel": 3,
              "prepTimeMinutes": 16,
              "allergens": "None",
              "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
            }
          ]
        },
        {
          "id": "b5497a5c-2883-4238-aa50-240272e45db9",
          "name": "Artisanal Breads & Pulao",
          "slug": "breads",
          "sortOrder": 3,
          "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb",
          "menuItems": [
            {
              "id": "1fa53da5-4406-4a20-8b12-70e1d42322e5",
              "name": "Sheermal Royal Saffron Flatbread",
              "description": "Traditional mildly sweet leavened bread kneaded with warm milk, saffron, and brushed with pure desi ghee.",
              "price": 120,
              "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
              "categoryId": "b5497a5c-2883-4238-aa50-240272e45db9",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": false,
              "spiceLevel": 0,
              "prepTimeMinutes": 6,
              "allergens": "Dairy, Gluten",
              "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
            },
            {
              "id": "b2585a26-e5f6-4a14-bfcc-0b7cfa02803f",
              "name": "Taftan Fluffy Bread",
              "description": "Delicate Persian-influenced tandoori bread flavored with saffron, green cardamom powder, and white sesame seeds.",
              "price": 110,
              "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
              "categoryId": "b5497a5c-2883-4238-aa50-240272e45db9",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": false,
              "spiceLevel": 0,
              "prepTimeMinutes": 5,
              "allergens": "Dairy, Gluten, Sesame",
              "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
            }
          ]
        },
        {
          "id": "d250472d-8b82-454e-ac18-77cd76e2c9ac",
          "name": "Darbar Mithai & Sharbath",
          "slug": "desserts",
          "sortOrder": 4,
          "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb",
          "menuItems": [
            {
              "id": "3520e770-9d8c-4235-bf92-c5326b3cad54",
              "name": "Zafrani Matka Phirni",
              "description": "Chilled slow-ground basmati rice pudding infused with pure saffron and kewra water, served in unglazed earthenware pots.",
              "price": 190,
              "imageUrl": "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=800&q=80",
              "categoryId": "d250472d-8b82-454e-ac18-77cd76e2c9ac",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 0,
              "prepTimeMinutes": 5,
              "allergens": "Dairy, Tree Nuts",
              "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
            },
            {
              "id": "86c36665-feb2-4820-9569-59dcf626232c",
              "name": "Rooh Afza Gulkand Sharbath",
              "description": "Chilled Damascus rose cooler with basil sabja seeds, damask rose petal jam, and crushed mountain ice.",
              "price": 130,
              "imageUrl": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
              "categoryId": "d250472d-8b82-454e-ac18-77cd76e2c9ac",
              "isAvailable": true,
              "isVeg": true,
              "isGlutenFree": true,
              "spiceLevel": 0,
              "prepTimeMinutes": 3,
              "allergens": "None",
              "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
            }
          ]
        }
      ],
      "tables": [
        {
          "id": "fa6472c0-8762-41f2-a2ed-e23ebef10b36",
          "number": "P-01",
          "capacity": 2,
          "section": "Khyber Diwan",
          "status": "FREE",
          "qrCodeUrl": "http://localhost:3000/?restaurant=peshawari-darbar&table=P-01",
          "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
        },
        {
          "id": "5a6dfb1a-919d-449e-8055-876fbff2d34b",
          "number": "P-02",
          "capacity": 4,
          "section": "Khyber Diwan",
          "status": "OCCUPIED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=peshawari-darbar&table=P-02",
          "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
        },
        {
          "id": "78cccde9-1da6-4fc1-8e2a-9f4ae40fec05",
          "number": "P-03",
          "capacity": 4,
          "section": "Frontier Courtyard",
          "status": "FREE",
          "qrCodeUrl": "http://localhost:3000/?restaurant=peshawari-darbar&table=P-03",
          "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
        },
        {
          "id": "c89a3f96-4dbd-4d2d-8d11-a53105265a87",
          "number": "P-04",
          "capacity": 6,
          "section": "Frontier Courtyard",
          "status": "RESERVED",
          "qrCodeUrl": "http://localhost:3000/?restaurant=peshawari-darbar&table=P-04",
          "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
        },
        {
          "id": "670e3114-80de-45a5-b9d9-836b86adfcd3",
          "number": "P-05",
          "capacity": 8,
          "section": "Royal Baithak Suite",
          "status": "FREE",
          "qrCodeUrl": "http://localhost:3000/?restaurant=peshawari-darbar&table=P-05",
          "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
        }
      ],
      "happyHourRules": [],
      "inventory": [],
      "users": []
    }
  ],
  "orders": [
    {
      "id": "a4fa75cb-4213-4a1e-a29e-1854740ef62a",
      "orderNumber": "ORD-1082",
      "type": "DINE_IN",
      "status": "READY",
      "paymentStatus": "PAID",
      "tableId": "23738471-6a89-4bc0-b8d9-eecd3157ef3d",
      "totalAmount": 966,
      "discountAmount": 0,
      "taxAmount": 46,
      "guestNotes": "Make Butter Chicken extra creamy, less spicy for kids!",
      "customerName": "Aarav Sharma",
      "customerPhone": "+91 98101 23456",
      "estimatedMinutes": 20,
      "createdAt": "2026-09-24T07:04:53.484Z",
      "updatedAt": "2026-09-24T10:15:51.065Z",
      "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
      "items": [
        {
          "id": "ea97c324-7d6e-4dc4-a108-8a8eeb55d890",
          "orderId": "a4fa75cb-4213-4a1e-a29e-1854740ef62a",
          "menuItemId": "2ba2f770-fb1c-4657-9a0e-4d74a0f516c8",
          "quantity": 1,
          "unitPrice": 480,
          "subtotal": 480,
          "selectedOptions": null,
          "notes": null,
          "menuItem": {
            "id": "2ba2f770-fb1c-4657-9a0e-4d74a0f516c8",
            "name": "Murgh Makhani (Butter Chicken)",
            "description": "Tandoor-smoked pulled chicken simmered in rich velvety San Marzano tomato reduction, churned butter, and cashew paste.",
            "price": 480,
            "imageUrl": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
            "categoryId": "2635c2ee-4350-452e-be6a-19cc5f136b3c",
            "isAvailable": true,
            "isVeg": false,
            "isGlutenFree": true,
            "spiceLevel": 1,
            "prepTimeMinutes": 16,
            "allergens": "Dairy, Tree Nuts",
            "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
          }
        },
        {
          "id": "c4d87fe4-4217-483a-8edf-9b5befc044d3",
          "orderId": "a4fa75cb-4213-4a1e-a29e-1854740ef62a",
          "menuItemId": "64bba3d9-de66-401f-be1f-0a7d131997b4",
          "quantity": 1,
          "unitPrice": 360,
          "subtotal": 360,
          "selectedOptions": null,
          "notes": null,
          "menuItem": {
            "id": "64bba3d9-de66-401f-be1f-0a7d131997b4",
            "name": "Dal Makhani Bukhara",
            "description": "Signature black urad lentils slow-cooked for 18 hours on charcoal embers with butter, cream, and sun-dried fenugreek leaves.",
            "price": 360,
            "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
            "categoryId": "2635c2ee-4350-452e-be6a-19cc5f136b3c",
            "isAvailable": true,
            "isVeg": true,
            "isGlutenFree": true,
            "spiceLevel": 1,
            "prepTimeMinutes": 15,
            "allergens": "Dairy",
            "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
          }
        },
        {
          "id": "1b911bfc-4537-4ce1-bb51-94df06ba51a9",
          "orderId": "a4fa75cb-4213-4a1e-a29e-1854740ef62a",
          "menuItemId": "461cabbf-4836-4902-8a25-688ce3987804",
          "quantity": 2,
          "unitPrice": 85,
          "subtotal": 170,
          "selectedOptions": null,
          "notes": null,
          "menuItem": {
            "id": "461cabbf-4836-4902-8a25-688ce3987804",
            "name": "Butter Garlic Naan",
            "description": "Clay tandoor blistered leavened bread generously brushed with minced roasted garlic, butter, and fresh coriander.",
            "price": 85,
            "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
            "categoryId": "c45a6589-dd2e-4649-96ef-7d9d39a5fbae",
            "isAvailable": true,
            "isVeg": true,
            "isGlutenFree": false,
            "spiceLevel": 0,
            "prepTimeMinutes": 5,
            "allergens": "Dairy, Gluten",
            "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
          }
        }
      ],
      "table": {
        "id": "23738471-6a89-4bc0-b8d9-eecd3157ef3d",
        "number": "T-02",
        "capacity": 4,
        "section": "Royal Haveli Hall",
        "status": "OCCUPIED",
        "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-02",
        "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
      }
    },
    {
      "id": "fd629fcc-d36d-4244-9a03-9c109a6bb393",
      "orderNumber": "ORD-2041",
      "type": "DINE_IN",
      "status": "PREPARING",
      "paymentStatus": "PAID",
      "tableId": "43cea1f4-a699-4b85-9ef9-0fb952fbe366",
      "totalAmount": 746,
      "discountAmount": 0,
      "taxAmount": 36,
      "guestNotes": "Extra coconut milk with Appam please!",
      "customerName": "Kavitha Swaminathan",
      "customerPhone": "+91 94440 88776",
      "estimatedMinutes": 18,
      "createdAt": "2026-09-24T07:04:53.694Z",
      "updatedAt": "2026-09-24T10:44:01.709Z",
      "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0",
      "items": [
        {
          "id": "1d6135e8-8ef6-4440-9399-d7271f9a86a0",
          "orderId": "fd629fcc-d36d-4244-9a03-9c109a6bb393",
          "menuItemId": "7280336e-d642-489f-a936-d5be6e273ad2",
          "quantity": 1,
          "unitPrice": 520,
          "subtotal": 520,
          "selectedOptions": null,
          "notes": null,
          "menuItem": {
            "id": "7280336e-d642-489f-a936-d5be6e273ad2",
            "name": "Kerala Meen Pollichathu",
            "description": "Fresh pearl spot sea fish coated in spicy shallot-tomato masala, wrapped in tender banana leaf and slow-griddled.",
            "price": 520,
            "imageUrl": "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80",
            "categoryId": "e992312c-2982-434e-a709-4edd70febef8",
            "isAvailable": true,
            "isVeg": false,
            "isGlutenFree": true,
            "spiceLevel": 3,
            "prepTimeMinutes": 18,
            "allergens": "Fish",
            "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
          }
        },
        {
          "id": "86a06d67-892b-4a6a-a028-1bb64045ff2f",
          "orderId": "fd629fcc-d36d-4244-9a03-9c109a6bb393",
          "menuItemId": "46b927f2-1b48-4abb-bd95-10cb24e501b3",
          "quantity": 2,
          "unitPrice": 95,
          "subtotal": 190,
          "selectedOptions": null,
          "notes": null,
          "menuItem": {
            "id": "46b927f2-1b48-4abb-bd95-10cb24e501b3",
            "name": "Fluffy Malabar Parotta (2 Pcs)",
            "description": "Signature flaky, layered and spiraled Kerala flatbread griddled to golden crispy perfection with ghee.",
            "price": 95,
            "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
            "categoryId": "bf2b7fd1-7728-4aaf-82f7-25ad70dcd537",
            "isAvailable": true,
            "isVeg": true,
            "isGlutenFree": false,
            "spiceLevel": 0,
            "prepTimeMinutes": 5,
            "allergens": "Gluten, Dairy",
            "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
          }
        }
      ],
      "table": {
        "id": "43cea1f4-a699-4b85-9ef9-0fb952fbe366",
        "number": "D-02",
        "capacity": 4,
        "section": "Backwater Deck",
        "status": "OCCUPIED",
        "qrCodeUrl": "http://localhost:3000/?restaurant=dakshin-coastal-kitchen&table=D-02",
        "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
      }
    },
    {
      "id": "82530459-667d-4c80-9546-9fe97a7ab618",
      "orderNumber": "ORD-3055",
      "type": "DINE_IN",
      "status": "PREPARING",
      "paymentStatus": "PAID",
      "tableId": "5a6dfb1a-919d-449e-8055-876fbff2d34b",
      "totalAmount": 1050,
      "discountAmount": 0,
      "taxAmount": 50,
      "guestNotes": "Extra spicy Karahi please!",
      "customerName": "Zainab Merchant",
      "customerPhone": "+91 98200 11223",
      "estimatedMinutes": 20,
      "createdAt": "2026-09-24T07:04:53.876Z",
      "updatedAt": "2026-09-24T07:04:53.876Z",
      "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb",
      "items": [
        {
          "id": "5103fcd7-e654-4d49-bd88-2802f87818c8",
          "orderId": "82530459-667d-4c80-9546-9fe97a7ab618",
          "menuItemId": "0cce81b4-3e09-45a9-81cb-696f555c5012",
          "quantity": 1,
          "unitPrice": 440,
          "subtotal": 440,
          "selectedOptions": null,
          "notes": null,
          "menuItem": {
            "id": "0cce81b4-3e09-45a9-81cb-696f555c5012",
            "name": "Peshawari Chapli Kebab",
            "description": "Rustic minced mutton patties kneaded with crushed coriander seeds, pomegranate seeds (anardana), tomatoes, and griddled in pure ghee.",
            "price": 440,
            "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
            "categoryId": "a9bbbc6e-edd3-4eb7-8c4f-6e7d0fc4a570",
            "isAvailable": true,
            "isVeg": false,
            "isGlutenFree": true,
            "spiceLevel": 3,
            "prepTimeMinutes": 15,
            "allergens": "Dairy",
            "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
          }
        },
        {
          "id": "b5b06e4b-d91b-4ad5-894d-27a09e097d71",
          "orderId": "82530459-667d-4c80-9546-9fe97a7ab618",
          "menuItemId": "c3633cfb-c730-490c-ac7d-e4fb42033545",
          "quantity": 1,
          "unitPrice": 470,
          "subtotal": 470,
          "selectedOptions": null,
          "notes": null,
          "menuItem": {
            "id": "c3633cfb-c730-490c-ac7d-e4fb42033545",
            "name": "Peshawari Murgh Karahi",
            "description": "Chicken pieces stir-cooked in an iron karahi with juicy vine tomatoes, ginger juliennes, green chilies, and freshly roasted black pepper.",
            "price": 470,
            "imageUrl": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
            "categoryId": "b34f4258-34e3-4ea0-81c6-c3f542bbb3f0",
            "isAvailable": true,
            "isVeg": false,
            "isGlutenFree": true,
            "spiceLevel": 3,
            "prepTimeMinutes": 16,
            "allergens": "None",
            "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
          }
        },
        {
          "id": "5014c196-c137-4571-b490-9129a710111b",
          "orderId": "82530459-667d-4c80-9546-9fe97a7ab618",
          "menuItemId": "1fa53da5-4406-4a20-8b12-70e1d42322e5",
          "quantity": 2,
          "unitPrice": 120,
          "subtotal": 240,
          "selectedOptions": null,
          "notes": null,
          "menuItem": {
            "id": "1fa53da5-4406-4a20-8b12-70e1d42322e5",
            "name": "Sheermal Royal Saffron Flatbread",
            "description": "Traditional mildly sweet leavened bread kneaded with warm milk, saffron, and brushed with pure desi ghee.",
            "price": 120,
            "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
            "categoryId": "b5497a5c-2883-4238-aa50-240272e45db9",
            "isAvailable": true,
            "isVeg": true,
            "isGlutenFree": false,
            "spiceLevel": 0,
            "prepTimeMinutes": 6,
            "allergens": "Dairy, Gluten",
            "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
          }
        }
      ],
      "table": {
        "id": "5a6dfb1a-919d-449e-8055-876fbff2d34b",
        "number": "P-02",
        "capacity": 4,
        "section": "Khyber Diwan",
        "status": "OCCUPIED",
        "qrCodeUrl": "http://localhost:3000/?restaurant=peshawari-darbar&table=P-02",
        "restaurantId": "2e8c8f10-5c72-4308-ae3d-d9b468e36efb"
      }
    },
    {
      "id": "bb3c0a9b-c468-49d7-9c16-f4469953435c",
      "orderNumber": "ORD-7979",
      "type": "DINE_IN",
      "status": "PLACED",
      "paymentStatus": "PAID",
      "tableId": "88c822c2-8a9c-4986-a19d-21814070d78f",
      "totalAmount": 399,
      "discountAmount": 0,
      "taxAmount": 19,
      "guestNotes": null,
      "customerName": "Ramesh Krishnan",
      "customerPhone": "+91 94441 22334",
      "estimatedMinutes": 20,
      "createdAt": "2026-09-24T07:32:19.854Z",
      "updatedAt": "2026-09-24T07:32:19.854Z",
      "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0",
      "items": [
        {
          "id": "1c1d1668-a5d5-4873-87ee-ef7c947d993d",
          "orderId": "bb3c0a9b-c468-49d7-9c16-f4469953435c",
          "menuItemId": "6d7c0a90-96d9-4ece-9b21-2546b5b84687",
          "quantity": 2,
          "unitPrice": 190,
          "subtotal": 380,
          "selectedOptions": null,
          "notes": null,
          "menuItem": {
            "id": "6d7c0a90-96d9-4ece-9b21-2546b5b84687",
            "name": "Ghee Podi Tossed Idlis",
            "description": "Steamed baby button idlis tossed in roasted lentil gunpowder podi and sizzling hot aromatic desi ghee.",
            "price": 190,
            "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
            "categoryId": "6a8c87ec-06fc-42d8-8097-58b0fd891872",
            "isAvailable": true,
            "isVeg": true,
            "isGlutenFree": true,
            "spiceLevel": 2,
            "prepTimeMinutes": 8,
            "allergens": "Dairy",
            "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
          }
        }
      ],
      "table": {
        "id": "88c822c2-8a9c-4986-a19d-21814070d78f",
        "number": "D-01",
        "capacity": 2,
        "section": "Backwater Deck",
        "status": "OCCUPIED",
        "qrCodeUrl": "http://localhost:3000/?restaurant=dakshin-coastal-kitchen&table=D-01",
        "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
      }
    },
    {
      "id": "be8c58ee-2a69-4625-be65-d3fd913420ff",
      "orderNumber": "ORD-8177",
      "type": "DINE_IN",
      "status": "PREPARING",
      "paymentStatus": "PAID",
      "tableId": "05fd830a-ab01-4a14-a8a5-7e784163d641",
      "totalAmount": 546,
      "discountAmount": 0,
      "taxAmount": 26,
      "guestNotes": null,
      "customerName": "Aarav Sharma",
      "customerPhone": null,
      "estimatedMinutes": 20,
      "createdAt": "2026-09-24T10:24:43.921Z",
      "updatedAt": "2026-09-24T10:37:12.947Z",
      "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
      "items": [
        {
          "id": "cf03bb97-2590-4779-acc5-2ca96c727015",
          "orderId": "be8c58ee-2a69-4625-be65-d3fd913420ff",
          "menuItemId": "2ba2f770-fb1c-4657-9a0e-4d74a0f516c8",
          "quantity": 1,
          "unitPrice": 520,
          "subtotal": 520,
          "selectedOptions": "[\"Extra Amul Butter & Cream Dollop\"]",
          "notes": null,
          "menuItem": {
            "id": "2ba2f770-fb1c-4657-9a0e-4d74a0f516c8",
            "name": "Murgh Makhani (Butter Chicken)",
            "description": "Tandoor-smoked pulled chicken simmered in rich velvety San Marzano tomato reduction, churned butter, and cashew paste.",
            "price": 480,
            "imageUrl": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
            "categoryId": "2635c2ee-4350-452e-be6a-19cc5f136b3c",
            "isAvailable": true,
            "isVeg": false,
            "isGlutenFree": true,
            "spiceLevel": 1,
            "prepTimeMinutes": 16,
            "allergens": "Dairy, Tree Nuts",
            "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
          }
        }
      ],
      "table": {
        "id": "05fd830a-ab01-4a14-a8a5-7e784163d641",
        "number": "T-01",
        "capacity": 2,
        "section": "Royal Haveli Hall",
        "status": "OCCUPIED",
        "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-01",
        "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
      }
    },
    {
      "id": "dc8d7a84-deb7-454a-a2fb-373c5af898fa",
      "orderNumber": "ORD-5888",
      "type": "DINE_IN",
      "status": "PLACED",
      "paymentStatus": "PAID",
      "tableId": "05fd830a-ab01-4a14-a8a5-7e784163d641",
      "totalAmount": 349,
      "discountAmount": 50,
      "taxAmount": 19,
      "guestNotes": null,
      "customerName": "Aarav Sharma",
      "customerPhone": null,
      "estimatedMinutes": 20,
      "createdAt": "2026-09-24T10:36:58.694Z",
      "updatedAt": "2026-09-24T10:36:58.694Z",
      "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
      "items": [
        {
          "id": "d3460f9f-5d9a-4fa9-a92a-2ca6d46a705a",
          "orderId": "dc8d7a84-deb7-454a-a2fb-373c5af898fa",
          "menuItemId": "83adf8b6-808a-48b2-aaa4-2d07ea4ee980",
          "quantity": 1,
          "unitPrice": 380,
          "subtotal": 380,
          "selectedOptions": "[\"Extra Amul Butter & Cream Dollop\"]",
          "notes": null,
          "menuItem": {
            "id": "83adf8b6-808a-48b2-aaa4-2d07ea4ee980",
            "name": "Paneer Tikka Angara",
            "description": "Charcoal-grilled cottage cheese cubes marinated in Kashmiri chili, hung yogurt, mustard oil, and bell peppers.",
            "price": 340,
            "imageUrl": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
            "categoryId": "b818682c-f7b0-4111-ba76-0fd938c2a329",
            "isAvailable": true,
            "isVeg": true,
            "isGlutenFree": true,
            "spiceLevel": 2,
            "prepTimeMinutes": 12,
            "allergens": "Dairy",
            "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
          }
        }
      ],
      "table": {
        "id": "05fd830a-ab01-4a14-a8a5-7e784163d641",
        "number": "T-01",
        "capacity": 2,
        "section": "Royal Haveli Hall",
        "status": "OCCUPIED",
        "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-01",
        "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
      }
    },
    {
      "id": "a47998ed-2c3c-4cbf-b5f2-31aadd2cbe44",
      "orderNumber": "ORD-2150",
      "type": "DINE_IN",
      "status": "PREPARING",
      "paymentStatus": "PAID",
      "tableId": "05fd830a-ab01-4a14-a8a5-7e784163d641",
      "totalAmount": 401.5,
      "discountAmount": 50,
      "taxAmount": 21.5,
      "guestNotes": null,
      "customerName": "Aarav Sharma",
      "customerPhone": null,
      "estimatedMinutes": 20,
      "createdAt": "2026-09-24T10:43:38.649Z",
      "updatedAt": "2026-09-24T10:43:50.239Z",
      "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f",
      "items": [
        {
          "id": "2b3a79b3-74b2-4b67-8601-148f6e331b5a",
          "orderId": "a47998ed-2c3c-4cbf-b5f2-31aadd2cbe44",
          "menuItemId": "04f5e3f9-9cfd-4258-9221-e11adb9f65d0",
          "quantity": 1,
          "unitPrice": 430,
          "subtotal": 430,
          "selectedOptions": "[\"Extra Amul Butter & Cream Dollop\"]",
          "notes": null,
          "menuItem": {
            "id": "04f5e3f9-9cfd-4258-9221-e11adb9f65d0",
            "name": "Paneer Butter Masala",
            "description": "Fresh malai paneer cubes gently cooked in a creamy spiced tomato gravy with crushed kasuri methi and fresh cream.",
            "price": 390,
            "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
            "categoryId": "2635c2ee-4350-452e-be6a-19cc5f136b3c",
            "isAvailable": true,
            "isVeg": true,
            "isGlutenFree": true,
            "spiceLevel": 1,
            "prepTimeMinutes": 14,
            "allergens": "Dairy, Tree Nuts",
            "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
          }
        }
      ],
      "table": {
        "id": "05fd830a-ab01-4a14-a8a5-7e784163d641",
        "number": "T-01",
        "capacity": 2,
        "section": "Royal Haveli Hall",
        "status": "OCCUPIED",
        "qrCodeUrl": "http://localhost:3000/?restaurant=the-royal-rasoi&table=T-01",
        "restaurantId": "ea3f3559-f1e9-4c10-8963-ad486b55538f"
      }
    },
    {
      "id": "2d64c258-4bd2-4422-ad01-b7793c315259",
      "orderNumber": "ORD-3305",
      "type": "PICKUP",
      "status": "PREPARING",
      "paymentStatus": "PAID",
      "tableId": null,
      "totalAmount": 441,
      "discountAmount": 0,
      "taxAmount": 21,
      "guestNotes": null,
      "customerName": "Aarav Sharma",
      "customerPhone": null,
      "estimatedMinutes": 20,
      "createdAt": "2026-09-26T20:18:12.786Z",
      "updatedAt": "2026-09-26T20:18:49.480Z",
      "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0",
      "items": [
        {
          "id": "4f1500e4-1a1a-4e40-90a4-a3bc9ab27cfe",
          "orderId": "2d64c258-4bd2-4422-ad01-b7793c315259",
          "menuItemId": "e1514c62-1821-43c7-91df-05d48c296e5e",
          "quantity": 1,
          "unitPrice": 420,
          "subtotal": 420,
          "selectedOptions": "[\"Chilled Boondi Raita Bowl\"]",
          "notes": null,
          "menuItem": {
            "id": "e1514c62-1821-43c7-91df-05d48c296e5e",
            "name": "Kozhi 65 Crisp Chicken",
            "description": "Tender chicken bites tossed with fresh curry leaves, crushed Byadgi chilies, ginger, and lemon zest.",
            "price": 360,
            "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
            "categoryId": "6a8c87ec-06fc-42d8-8097-58b0fd891872",
            "isAvailable": true,
            "isVeg": false,
            "isGlutenFree": true,
            "spiceLevel": 3,
            "prepTimeMinutes": 12,
            "allergens": "None",
            "restaurantId": "9b08ce68-d84c-4b1b-a330-c7e207e25ca0"
          }
        }
      ],
      "table": null
    }
  ]
};
