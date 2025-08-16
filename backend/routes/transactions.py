from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, date
from models.transaction import Transaction, TransactionCreate, MonthlySummary
from database import get_database

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

@router.get("/", response_model=List[Transaction])
async def get_transactions(
    month: Optional[str] = Query(None, description="Filter by month (YYYY-MM format)"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all transactions with optional month filter"""
    try:
        query = {}
        if month:
            # Validate month format
            try:
                datetime.strptime(month, "%Y-%m")
                query["transaction_date"] = {"₹regex": f"^{month}"}
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
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new transaction"""
    try:
        # Verify category exists
        category = await db.categories.find_one({"name": transaction_data.category})
        if not category:
            raise HTTPException(status_code=400, detail="Category does not exist")
        
        # Create transaction
        transaction = Transaction(**transaction_data.dict())
        transaction_dict = transaction.dict()
        
        # Convert date objects to strings for MongoDB
        if 'transaction_date' in transaction_dict:
            transaction_dict['transaction_date'] = transaction_dict['transaction_date'].isoformat()
        if 'created_at' in transaction_dict:
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
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a transaction"""
    try:
        result = await db.transactions.delete_one({"id": transaction_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        return {"message": "Transaction deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting transaction: {str(e)}")

@router.get("/summary/{month}", response_model=MonthlySummary)
async def get_monthly_summary(
    month: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get monthly summary for a specific month"""
    try:
        # Validate month format
        try:
            datetime.strptime(month, "%Y-%m")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid month format. Use YYYY-MM")
        
        # Get transactions for the month
        cursor = db.transactions.find({"transaction_date": {"₹regex": f"^{month}"}})
        transactions = await cursor.to_list(1000)
        
        total_income = sum(t["amount"] for t in transactions if t["transaction_type"] == "income")
        total_expenses = sum(t["amount"] for t in transactions if t["transaction_type"] == "expense")
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