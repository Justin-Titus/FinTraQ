from fastapi import APIRouter, HTTPException, Depends
from typing import List
from typing import Any
from models.category import Category, CategoryCreate
from database import get_database
from seed_data import seed_categories

router = APIRouter(prefix="/api/categories", tags=["categories"])

@router.get("/", response_model=List[Category])
async def get_categories(db: Any = Depends(get_database)):
    """Return all categories (predefined + custom)"""
    try:
        # Lazy seed categories for fresh tenant DBs
        if await db.categories.count_documents({}) == 0:
            await seed_categories(db)
        cursor = db.categories.find({})
        categories = await cursor.to_list(1000)
        # Ensure Pydantic model validation / defaults are applied
        return [Category(**c) for c in categories]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

@router.post("/", response_model=Category)
async def create_category(category_in: CategoryCreate, db: Any = Depends(get_database)):
    """Create a new category (must be income or expense)"""
    try:
        if category_in.type not in ("income", "expense"):
            raise HTTPException(status_code=400, detail="Category type must be 'income' or 'expense'")
        # Prevent duplicate category name + type
        existing = await db.categories.find_one({"name": category_in.name, "type": category_in.type})
        if existing:
            raise HTTPException(status_code=400, detail="Category with this name and type already exists")
        new_cat = Category(name=category_in.name, type=category_in.type)
        await db.categories.insert_one(new_cat.dict())
        return new_cat
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating category: {str(e)}")

@router.delete("/{category_id}")
async def delete_category(category_id: str, db: Any = Depends(get_database)):
    """Delete a category if no transactions reference its name"""
    try:
        category_doc = await db.categories.find_one({"id": category_id})
        if not category_doc:
            raise HTTPException(status_code=404, detail="Category not found")

        # Prevent deletion if any transaction uses this category (transactions store category name)
        tx_count = await db.transactions.count_documents({"category": category_doc["name"]})
        if tx_count > 0:
            raise HTTPException(status_code=400, detail="Cannot delete category that is being used in transactions")

        result = await db.categories.delete_one({"id": category_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Category not found")
        return {"message": "Category deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting category: {str(e)}")
