const sampleData = [
    {
        "name": "Bitter Melon (Ampalaya)",
        "slug": "bitter-melon-ampalaya",
        "type": 1,
        "description": " ",
        "variants": [{
                "id": "bf416b2d-b82d-4d4e-95c5-784e03f63156",
                "name": "Big",
                "price": 96,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/11168354/pexels-photo-11168354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }, {
                "id": "32792ab6-5fdc-4006-ac5f-0d96b9ae5df8",
                "name": "Small",
                "price": 48,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/13569982/pexels-photo-13569982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }
        ],
    }, {
        "name": "Cabbage (Repolyo)",
        "slug": "cabbage-repolyo",
        "type": 1,
        "description": "Benguet Cabbage (Scorpio)",
        "variants": [{
                "id": "0c715086-e187-497a-926c-5eb0beefa1a2",
                "name": "750g-1kg/head",
                "price": 70,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/7742458/pexels-photo-7742458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }
        ],
    }, {
        "name": "Carrot (Karot)",
        "slug": "carrot-karot",
        "type": 1,
        "description": "Benguet Carrots",
        "variants": [{
                "id": "893b35e6-60b2-404b-af92-144fe1f0f5a7",
                "name": "8-10 pcs/kg",
                "price": 100,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/1297256/pexels-photo-1297256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }
        ],
    }, {
        "name": "Chayote (Sayote)",
        "slug": "chayote-sayote",
        "type": 1,
        "description": "Benguet Chayote",
        "variants": [{
                "id": "a0e54083-189d-46e0-a1c7-7e8f9fabbd67",
                "name": "Kilo",
                "price": 42,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/7543109/pexels-photo-7543109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }
        ],
    }, {
        "name": "Squash (Kalabasa)",
        "slug": "kalabasa",
        "type": 1,
        "description": " ",
        "variants": [{
                "id": "ec1dc389-7417-4d4c-a586-38654d30083d",
                "name": "Kilo",
                "price": 56,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/1423020/pexels-photo-1423020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }
        ],
    }, {
        "name": "Pechay",
        "slug": "pechay",
        "type": 1,
        "description": "Baguio Pechay",
        "variants": [{
                "id": "16220f13-4188-43e5-8144-c4d9b2bf1c63",
                "name": "Kilo",
                "price": 63,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/6157085/pexels-photo-6157085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }
        ],
    }, {
        "name": "Banana (Saging)",
        "slug": "banana-saging",
        "type": 1,
        "description": "Lakatan",
        "variants": [{
                "id": "002ca28c-90db-44da-86b7-f04b10df4969",
                "name": "8-10 pcs/kg",
                "price": 98,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }
        ],
    }, {
        "name": "Chicken Egg (Itlog)",
        "slug": "chicken-egg",
        "type": 2,
        "description": "White Eggs",
        "variants": [{
                "id": "fc2abf81-0ff3-4a66-808b-f2f9f4efc434",
                "name": "Medium",
                "price": 8,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/6294169/pexels-photo-6294169.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }
        ],
    }, {
        "name": "Chicken Meat (Karneng Manok)",
        "slug": "chicken-meat-karneng-manok",
        "type": 2,
        "description": "Wings",
        "variants": [{
                "id": "91b5049f-4bf7-4e50-93c4-ad6f81f7c141",
                "name": "Wings/Kilo",
                "price": 175,
                "stock": 100,
                "imageUrl": "https://cdn.pixabay.com/photo/2020/06/01/09/06/chicken-wings-5245794_1280.jpg",
            }, {
                "id": "a30fcb85-bc8d-47c4-ba5f-6ab75ae72c07",
                "name": "Whole Chicken/Fully Dressed",
                "price": 180,
                "stock": 100,
                "imageUrl": "https://img.freepik.com/free-photo/raw-chicken-meat_1203-6759.jpg?w=996&t=st=1702866715~exp=1702867315~hmac=f1f670db2e9690b220f1812dc802e64a34501385fb161242f9f745345cc91b69",
            }
        ],
    }, {
        "name": "Beef Rump",
        "slug": "beef-rump",
        "type": 2,
        "description": "Lean Meat/Tapadera",
        "variants": [{
                "id": "137c72f2-e7d8-4dfb-b7e7-6aa9aea1ecfa",
                "name": "Kilo",
                "price": 440,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/8477074/pexels-photo-8477074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }
        ],
    }, {
        "name": "Pork Belly (Karneng Baboy)",
        "slug": "pork-belly-karneng-baboy",
        "type": 2,
        "description": "Liempo",
        "variants": [{
                "id": "96304f80-8954-42fe-8d56-5511b1b7bb44",
                "name": "Kilo",
                "price": 348,
                "stock": 100,
                "imageUrl": "https://images.pexels.com/photos/8251005/pexels-photo-8251005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }
        ],
    }
];

export default sampleData;
