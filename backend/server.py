from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import routes
from routes.categories import router as categories_router
from routes.transactions import router as transactions_router

# Import seeding
from seed_data import seed_database
from database import get_database

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Budget Planner API", version="1.0.0")

# Include routers
app.include_router(categories_router)
app.include_router(transactions_router)

# Original API router for backward compatibility
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "Budget Planner API is running!", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# Include the original router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database and seed data on startup"""
    try:
        logger.info("🚀 Starting Budget Planner API...")
        
        # Test database connection
        await db.command("ping")
        logger.info("✅ Database connection successful")
        
        # Seed database with initial data
        await seed_database(db)
        
        logger.info("🎉 Budget Planner API started successfully!")
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    try:
        client.close()
        logger.info("✅ Database connection closed")
    except Exception as e:
        logger.error(f"❌ Shutdown error: {e}")

# Root endpoint redirect
@app.get("/")
async def redirect_to_api():
    return {"message": "Welcome to Budget Planner API", "docs": "/docs", "api": "/api"}