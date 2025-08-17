from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging

from routes.categories import router as categories_router
from routes.transactions import router as transactions_router
from database import get_database

# ---------- Setup ----------
load_dotenv()
logger = logging.getLogger("fintraq")
logging.basicConfig(level=logging.INFO)

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "FinTraQ")
PORT = int(os.environ.get("PORT", "8000"))

if not MONGO_URL:
    raise RuntimeError("MONGO_URL is not set")

# Create app
app = FastAPI(title="FinTraQ API")

# CORS
cors_origins_raw = os.environ.get("CORS_ORIGINS", "")
allow_origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()] or ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mongo client (global)
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Inject our db into dependency
# database.get_database returns the shared db, so we override its module-level value
import database as _dbmod
_dbmod.client = client
_dbmod.db = db

# ---------- Routers ----------
app.include_router(categories_router)
app.include_router(transactions_router)

# ---------- Lifecycle ----------
@app.on_event("startup")
async def on_startup():
    try:
        await db.command("ping")
        logger.info("✅ Connected to MongoDB and ping successful")
        # Optional: seed database (uncomment if you want initial data)
        # from seed_data import seed_database
        # await seed_database(db)
    except Exception as e:
        logger.exception(f"❌ Startup error: {e}")
        raise

@app.on_event("shutdown")
async def on_shutdown():
    try:
        client.close()
        logger.info("✅ MongoDB connection closed")
    except Exception as e:
        logger.exception(f"❌ Shutdown error: {e}")

@app.get("/")
async def root():
    return {"message": "Welcome to FinTraQ API", "docs": "/docs", "api": "/api"}
