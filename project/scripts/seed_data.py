import asyncio
import sys
sys.path.insert(0, '/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
import uuid

async def seed_database():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("Seeding database...")
    
    # Clear existing data
    await db.products.delete_many({})
    await db.testimonials.delete_many({})
    await db.metal_rates.delete_many({})
    
    # Insert metal rates
    metal_rates = {
        "id": str(uuid.uuid4()),
        "gold_22k": 6500.0,
        "gold_24k": 7000.0,
        "silver_999": 85.0,
        "diamond_per_carat": 70000.0,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_by": "admin"
    }
    await db.metal_rates.insert_one(metal_rates)
    print("✓ Metal rates added")
    
    # Sample products
    products = [
        # Gold Jewellery for Women
        {
            "id": str(uuid.uuid4()),
            "name": "Traditional Gold Necklace",
            "description": "Exquisite 22K gold necklace with intricate traditional design. Perfect for weddings and special occasions. Handcrafted by master artisans with attention to detail.",
            "metal_type": "Gold",
            "purity": "22K",
            "weight": 25.5,
            "dimensions": "45cm length",
            "category": "Women",
            "occasion": "Wedding",
            "images": [
                {"url": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600", "caption": "Front View", "is_cover": True},
                {"url": "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=600", "caption": "Close-up", "is_cover": False}
            ],
            "view_count": 120,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Gold Temple Earrings",
            "description": "Beautiful temple-style gold earrings featuring traditional South Indian motifs. Lightweight and comfortable for all-day wear.",
            "metal_type": "Gold",
            "purity": "22K",
            "weight": 8.5,
            "dimensions": "3cm x 2cm",
            "category": "Women",
            "occasion": "Festive",
            "images": [
                {"url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600", "caption": "Product View", "is_cover": True}
            ],
            "view_count": 89,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Gold Chain Bracelet",
            "description": "Elegant 22K gold bracelet with a delicate chain design. Perfect for daily wear and special occasions.",
            "metal_type": "Gold",
            "purity": "22K",
            "weight": 12.0,
            "dimensions": "19cm length",
            "category": "Women",
            "occasion": "Daily Wear",
            "images": [
                {"url": "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600", "caption": "Bracelet", "is_cover": True}
            ],
            "view_count": 65,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        # Gold Jewellery for Men
        {
            "id": str(uuid.uuid4()),
            "name": "Men's Gold Chain",
            "description": "Classic 22K gold chain for men. Strong and durable design perfect for everyday wear. BIS hallmarked.",
            "metal_type": "Gold",
            "purity": "22K",
            "weight": 18.0,
            "dimensions": "50cm length",
            "category": "Men",
            "occasion": "Daily Wear",
            "images": [
                {"url": "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=600", "caption": "Gold Chain", "is_cover": True}
            ],
            "view_count": 45,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Gold Ring for Men",
            "description": "Sophisticated gold ring with modern design. Available in multiple sizes. Perfect for weddings and formal occasions.",
            "metal_type": "Gold",
            "purity": "22K",
            "weight": 6.5,
            "dimensions": "Size adjustable",
            "category": "Men",
            "occasion": "Wedding",
            "images": [
                {"url": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600", "caption": "Ring", "is_cover": True}
            ],
            "view_count": 38,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        # Silver Jewellery
        {
            "id": str(uuid.uuid4()),
            "name": "Silver Anklets (Pair)",
            "description": "Traditional 925 silver anklets with beautiful ghungroo design. Comfortable and elegant.",
            "metal_type": "Silver",
            "purity": "925",
            "weight": 35.0,
            "dimensions": "25cm each",
            "category": "Women",
            "occasion": "Daily Wear",
            "images": [
                {"url": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600", "caption": "Silver Anklets", "is_cover": True}
            ],
            "view_count": 72,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Silver Pendant Set",
            "description": "Beautiful oxidized silver pendant with matching earrings. Contemporary design perfect for modern wear.",
            "metal_type": "Silver",
            "purity": "925",
            "weight": 15.5,
            "dimensions": "Pendant: 3cm",
            "category": "Women",
            "occasion": "Daily Wear",
            "images": [
                {"url": "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600", "caption": "Silver Set", "is_cover": True}
            ],
            "view_count": 56,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        # Diamond Jewellery
        {
            "id": str(uuid.uuid4()),
            "name": "Diamond Solitaire Ring",
            "description": "Stunning diamond solitaire ring set in 18K gold. Certified diamond with excellent cut and clarity. Perfect engagement ring.",
            "metal_type": "Diamond",
            "purity": "18K",
            "weight": 0.5,
            "dimensions": "0.5 carat",
            "category": "Women",
            "occasion": "Wedding",
            "images": [
                {"url": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600", "caption": "Diamond Ring", "is_cover": True}
            ],
            "view_count": 145,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Diamond Stud Earrings",
            "description": "Classic diamond stud earrings in 18K white gold. Timeless elegance for everyday luxury.",
            "metal_type": "Diamond",
            "purity": "18K",
            "weight": 0.3,
            "dimensions": "0.3 carat total",
            "category": "Women",
            "occasion": "Daily Wear",
            "images": [
                {"url": "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600", "caption": "Diamond Studs", "is_cover": True}
            ],
            "view_count": 98,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        # Kids Jewellery
        {
            "id": str(uuid.uuid4()),
            "name": "Kids Gold Bracelet",
            "description": "Adorable 22K gold bracelet for children. Lightweight and safe design with secure clasp.",
            "metal_type": "Gold",
            "purity": "22K",
            "weight": 4.5,
            "dimensions": "15cm adjustable",
            "category": "Kids",
            "occasion": "Gifting",
            "images": [
                {"url": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600", "caption": "Kids Bracelet", "is_cover": True}
            ],
            "view_count": 34,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Baby Gold Earrings",
            "description": "Delicate 22K gold earrings perfect for babies and young children. Hypoallergenic and comfortable.",
            "metal_type": "Gold",
            "purity": "22K",
            "weight": 2.5,
            "dimensions": "Small size",
            "category": "Kids",
            "occasion": "Gifting",
            "images": [
                {"url": "https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=600", "caption": "Baby Earrings", "is_cover": True}
            ],
            "view_count": 42,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.products.insert_many(products)
    print(f"✓ {len(products)} products added")
    
    # Sample testimonials
    testimonials = [
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Priya Sharma",
            "rating": 5,
            "review": "Absolutely beautiful craftsmanship! The gold necklace I purchased for my wedding was stunning. DGM Gold Works has been our family's trusted jeweller for years.",
            "product_type": "Gold Necklace",
            "is_approved": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Rajesh Kumar",
            "rating": 5,
            "review": "Excellent service and transparent pricing. The BIS hallmark gives complete peace of mind. Highly recommend DGM Gold Works for authentic jewellery.",
            "product_type": "Gold Chain",
            "is_approved": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Lakshmi Devi",
            "rating": 5,
            "review": "The custom design service is exceptional! They brought my vision to life perfectly. The artisans are truly skilled and the quality is outstanding.",
            "product_type": "Custom Gold Bangles",
            "is_approved": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Anand Reddy",
            "rating": 4,
            "review": "Great experience shopping here. Wide collection and helpful staff. The metal rates are updated regularly which shows their transparency.",
            "product_type": "Diamond Ring",
            "is_approved": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.testimonials.insert_many(testimonials)
    print(f"✓ {len(testimonials)} testimonials added")
    
    print("\n✅ Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
