from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional, Any
from datetime import datetime, date
from models.transaction import Transaction, TransactionCreate, MonthlySummary
from database import get_database
from dependencies import get_current_user

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

@router.get("/", response_model=List[Transaction])
async def get_transactions(
    month: Optional[str] = Query(None, description="Filter by month (YYYY-MM format)"),
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Get all transactions for authenticated user with optional month filter"""
    try:
        user_id = current_user.get("id") or str(current_user.get("_id"))
        query = {
            "$or": [
                {"user_id": user_id},
                {"user_id": None},
                {"user_id": {"$exists": False}}
            ]
        }
        
        if month:
            try:
                datetime.strptime(month, "%Y-%m")
                query["$and"] = [
                    {"$or": [{"transaction_date": {"$regex": f"^{month}"}}, {"date": {"$regex": f"^{month}"}}]}
                ]
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid month format. Use YYYY-MM")
        
        cursor = db.transactions.find(query).sort("transaction_date", -1)
        transactions = await cursor.to_list(1000)
        
        return [Transaction(**transaction) for transaction in transactions]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching transactions: {str(e)}")

@router.post("/", response_model=Transaction)
async def create_transaction(
    transaction_data: TransactionCreate,
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Create a new transaction for authenticated user"""
    try:
        user_id = current_user.get("id") or str(current_user.get("_id"))
        
        # Verify category exists (predefined or user custom category)
        category = await db.categories.find_one({
            "name": transaction_data.category,
            "$or": [
                {"user_id": None},
                {"user_id": {"$exists": False}},
                {"user_id": user_id}
            ]
        })
        if not category:
            raise HTTPException(status_code=400, detail="Category does not exist")
        
        # Create transaction scoped to current user
        transaction = Transaction(
            user_id=user_id,
            **transaction_data.dict()
        )
        transaction_dict = transaction.dict()
        
        # Convert date objects to strings for MongoDB
        if 'transaction_date' in transaction_dict and isinstance(transaction_dict['transaction_date'], (date, datetime)):
            transaction_dict['transaction_date'] = transaction_dict['transaction_date'].isoformat()
        if 'created_at' in transaction_dict and isinstance(transaction_dict['created_at'], datetime):
            transaction_dict['created_at'] = transaction_dict['created_at'].isoformat()
        
        await db.transactions.insert_one(transaction_dict)
        return transaction
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating transaction: {str(e)}")

@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Delete a transaction owned by authenticated user"""
    try:
        user_id = current_user.get("id") or str(current_user.get("_id"))
        result = await db.transactions.delete_one({"id": transaction_id, "user_id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not found or not owned by user")
        
        return {"message": "Transaction deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting transaction: {str(e)}")

@router.get("/summary/{month}", response_model=MonthlySummary)
async def get_monthly_summary(
    month: str,
    db: Any = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Get monthly summary for authenticated user"""
    try:
        user_id = current_user.get("id") or str(current_user.get("_id"))
        try:
            datetime.strptime(month, "%Y-%m")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid month format. Use YYYY-MM")
        
        cursor = db.transactions.find({
            "$or": [
                {"user_id": user_id},
                {"user_id": None},
                {"user_id": {"$exists": False}}
            ],
            "$and": [
                {"$or": [{"transaction_date": {"$regex": f"^{month}"}}, {"date": {"$regex": f"^{month}"}}]}
            ]
        })
        transactions = await cursor.to_list(1000)
        
        total_income = sum(
            t.get("amount", 0) for t in transactions 
            if (t.get("transaction_type") == "income" or t.get("type") == "income")
        )
        total_expenses = sum(
            t.get("amount", 0) for t in transactions 
            if (t.get("transaction_type") == "expense" or t.get("type") == "expense")
        )
        balance = total_income - total_expenses
        
        return MonthlySummary(
            total_income=total_income,
            total_expenses=total_expenses,
            balance=balance,
            month=month
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating summary: {str(e)}")
