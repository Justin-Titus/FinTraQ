from motor.motor_asyncio import AsyncIOMotorClient
from typing import Any
import os
from dotenv import load_dotenv
from fastapi import Request

load_dotenv()

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/fintraq')
db_name = os.environ.get('DB_NAME', 'fintraq')

# Instantiate a single global client for connection pooling
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

async def get_database(request: Request = None) -> Any:
    """
    Dependency returning the MongoDB database instance.
    Reuses the global connection pool.
    """
    return db

async def close_database():
    """Close database connection"""
    client.close()