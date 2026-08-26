from fastapi import APIRouter, HTTPException, Depends
from typing import List, Any
from models.category import Category, CategoryCreate
from database import get_database
from dependencies import get_current_user
from seed_data import seed_categories

router = APIRouter(prefix="/api/categories", tags=["categories"])

@router.get("/", response_model=List[Category])
async def get_categories(
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Return all predefined categories plus custom user categories"""
    try:
        user_id = current_user.get("id") or str(current_user.get("_id"))
        
        # Ensure predefined categories exist
        if await db.categories.count_documents({"$or": [{"user_id": None}, {"user_id": {"$exists": False}}]}) == 0:
            await seed_categories(db)
            
        cursor = db.categories.find({
            "$or": [
                {"user_id": None},
                {"user_id": {"$exists": False}},
                {"user_id": user_id}
            ]
        })
        categories = await cursor.to_list(1000)
        return [Category(**c) for c in categories]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

@router.post("/", response_model=Category)
async def create_category(
    category_in: CategoryCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Create a new custom category for the authenticated user"""
    try:
        user_id = current_user.get("id") or str(current_user.get("_id"))
        if category_in.type not in ("income", "expense"):
            raise HTTPException(status_code=400, detail="Category type must be 'income' or 'expense'")
            
        # Prevent duplicate category name + type for this user
        existing = await db.categories.find_one({
            "name": category_in.name,
            "type": category_in.type,
            "$or": [
                {"user_id": None},
                {"user_id": {"$exists": False}},
                {"user_id": user_id}
            ]
        })
        if existing:
            raise HTTPException(status_code=400, detail="Category with this name and type already exists")
            
        new_cat = Category(
            name=category_in.name,
            type=category_in.type,
            user_id=user_id,
            is_custom=True
        )
        cat_dict = new_cat.dict()
        if 'created_at' in cat_dict and isinstance(cat_dict['created_at'], datetime):
            cat_dict['created_at'] = cat_dict['created_at'].isoformat()
            
        await db.categories.insert_one(cat_dict)
        return new_cat
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating category: {str(e)}")

@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Delete a custom category owned by the user if not referenced by transactions"""
    try:
        user_id = current_user.get("id") or str(current_user.get("_id"))
        category_doc = await db.categories.find_one({"id": category_id, "user_id": user_id})
        if not category_doc:
            raise HTTPException(status_code=404, detail="Custom category not found or not owned by user")

        # Prevent deletion if any transaction of this user uses this category
        tx_count = await db.transactions.count_documents({"category": category_doc["name"], "user_id": user_id})
        if tx_count > 0:
            raise HTTPException(status_code=400, detail="Cannot delete category that is being used in transactions")

        result = await db.categories.delete_one({"id": category_id, "user_id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Category not found")
        return {"message": "Category deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting category: {str(e)}")
