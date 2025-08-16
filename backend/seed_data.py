from motor.motor_asyncio import AsyncIOMotorDatabase
from models.category import Category
from models.transaction import Transaction
from datetime import date, datetime
import asyncio

# Predefined categories
PREDEFINED_CATEGORIES = [
    # Income Categories
    {"name": "Salary", "type": "income"},
    {"name": "Freelance", "type": "income"},
    {"name": "Investment", "type": "income"},
    {"name": "Business", "type": "income"},
    {"name": "Other Income", "type": "income"},
    
    # Expense Categories
    {"name": "Food & Dining", "type": "expense"},
    {"name": "Transportation", "type": "expense"},
    {"name": "Shopping", "type": "expense"},
    {"name": "Entertainment", "type": "expense"},
    {"name": "Bills & Utilities", "type": "expense"},
    {"name": "Healthcare", "type": "expense"},
    {"name": "Education", "type": "expense"},
    {"name": "Travel", "type": "expense"},
    {"name": "Home & Garden", "type": "expense"},
    {"name": "Personal Care", "type": "expense"},
    {"name": "Gifts & Donations", "type": "expense"},
    {"name": "Other Expenses", "type": "expense"}
]

# Sample transactions
SAMPLE_TRANSACTIONS = [
    # Current month transactions
    {"transaction_type": "income", "amount": 5000, "category": "Salary", "description": "Monthly salary", "transaction_date": date.today().isoformat()},
    {"transaction_type": "income", "amount": 800, "category": "Freelance", "description": "Web design project", "transaction_date": date.today().replace(day=12).isoformat()},
    {"transaction_type": "expense", "amount": 1200, "category": "Bills & Utilities", "description": "Rent payment", "transaction_date": date.today().replace(day=13).isoformat()},
    {"transaction_type": "expense", "amount": 350, "category": "Food & Dining", "description": "Groceries", "transaction_date": date.today().replace(day=11).isoformat()},
    {"transaction_type": "expense", "amount": 80, "category": "Transportation", "description": "Gas & parking", "transaction_date": date.today().replace(day=10).isoformat()},
    {"transaction_type": "expense", "amount": 120, "category": "Entertainment", "description": "Movie tickets", "transaction_date": date.today().replace(day=9).isoformat()},
    {"transaction_type": "expense", "amount": 200, "category": "Shopping", "description": "Clothing", "transaction_date": date.today().replace(day=8).isoformat()},
    {"transaction_type": "income", "amount": 300, "category": "Investment", "description": "Dividend payout", "transaction_date": date.today().replace(day=7).isoformat()},
]

async def seed_categories(db: AsyncIOMotorDatabase):
    """Seed predefined categories if they don't exist"""
    try:
        for cat_data in PREDEFINED_CATEGORIES:
            existing = await db.categories.find_one({"name": cat_data["name"]})
            if not existing:
                category = Category(name=cat_data["name"], type=cat_data["type"])
                await db.categories.insert_one(category.dict())
                print(f"✓ Seeded category: {cat_data['name']}")
        
        print("✅ Categories seeding completed")
    except Exception as e:
        print(f"❌ Error seeding categories: {e}")

async def seed_transactions(db: AsyncIOMotorDatabase):
    """Seed sample transactions if none exist"""
    try:
        existing_count = await db.transactions.count_documents({})
        if existing_count == 0:
            for trans_data in SAMPLE_TRANSACTIONS:
                # Create a proper Transaction object
                transaction_dict = trans_data.copy()
                transaction = Transaction(**transaction_dict)
                
                # Convert to dict with proper serialization
                transaction_data = transaction.dict()
                # Convert date objects to strings for MongoDB
                if 'transaction_date' in transaction_data:
                    transaction_data['transaction_date'] = transaction_data['transaction_date'].isoformat()
                if 'created_at' in transaction_data:
                    transaction_data['created_at'] = transaction_data['created_at'].isoformat()
                
                await db.transactions.insert_one(transaction_data)
                print(f"✓ Seeded transaction: {trans_data['description']}")
            
            print("✅ Transactions seeding completed")
        else:
            print(f"⚠️ Transactions already exist ({existing_count} found), skipping seed")
    except Exception as e:
        print(f"❌ Error seeding transactions: {e}")

async def seed_database(db: AsyncIOMotorDatabase):
    """Seed all required data"""
    print("🌱 Starting database seeding...")
    
    await seed_categories(db)
    await seed_transactions(db)
    
    print("🎉 Database seeding completed!")

if __name__ == "__main__":
    # For testing purposes
    import os
    from motor.motor_asyncio import AsyncIOMotorClient
    
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'FinTraQ')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    asyncio.run(seed_database(db))