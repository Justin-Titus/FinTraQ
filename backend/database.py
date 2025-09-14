from motor.motor_asyncio import AsyncIOMotorClient
from typing import Any
import os
from dotenv import load_dotenv
from fastapi import Request, HTTPException

load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
default_db_name = os.environ['DB_NAME']
db = client[default_db_name]

async def get_database(request: Request) -> Any:
    """
    Dependency to get database instance. Supports per-user database via header `X-Tenant-DB`.
    Fallbacks to default DB when header is absent.
    """
    tenant_db = request.headers.get('X-Tenant-DB')
    if tenant_db:
        # Basic safeguard to allow only alphanumerics, dash, underscore
        if not all(ch.isalnum() or ch in ('-', '_') for ch in tenant_db):
            raise HTTPException(status_code=400, detail='Invalid tenant database name')
        return client[tenant_db]
    return db

async def close_database():
    """Close database connection"""
    client.close()