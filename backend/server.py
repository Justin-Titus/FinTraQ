from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import routes
from routes.auth import router as auth_router
from routes.categories import router as categories_router
from routes.transactions import router as transactions_router

# Import seeding & DB
from seed_data import seed_categories
from database import get_database, db, client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create main app
app = FastAPI(title="FinTraQ API", version="1.0.0")

# Configure CORS middleware securely
cors_origins_raw = os.environ.get("CORS_ORIGIN", "http://localhost:3000,http://127.0.0.1:3000,https://fintraq.onrender.com")
cors_origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

is_prod = os.environ.get("NODE_ENV") == "production" or os.environ.get("ENVIRONMENT") == "production"

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins if cors_origins else ["http://localhost:3000"],
    allow_origin_regex=None if is_prod else r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(categories_router)
app.include_router(transactions_router)

# Health & Root router
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "FinTraQ API is running!", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database and seed predefined categories on startup"""
    try:
        logger.info("🚀 Starting FinTraQ FastAPI Backend...")
        await db.command("ping")
        logger.info("✅ Database connection successful")
        
        # Seed predefined categories if missing
        await seed_categories(db)
        logger.info("🎉 FinTraQ API initialized successfully!")
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up DB connection on shutdown"""
    try:
        client.close()
        logger.info("✅ Database connection closed")
    except Exception as e:
        logger.error(f"❌ Shutdown error: {e}")

@app.get("/")
async def redirect_to_api():
    return {"message": "Welcome to FinTraQ API", "docs": "/docs", "api": "/api"}