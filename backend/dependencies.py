from fastapi import Request, HTTPException, Depends, status
from typing import Dict, Any
from utils.auth import decode_access_token
from database import get_database

async def get_current_user(
    request: Request,
    db: Any = Depends(get_database)
) -> Dict[str, Any]:
    """
    FastAPI dependency that extracts Bearer token from Authorization header,
    validates JWT, and loads current user from MongoDB.
    """
    auth_header = request.headers.get("Authorization") or ""
    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Missing or invalid token format"
        )
    
    token = auth_header[7:].strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Empty token"
        )
    
    try:
        payload = decode_access_token(token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    from bson import ObjectId

    user = await db.users.find_one({"id": user_id})
    if not user:
        # Fallback check for MongoDB _id string representation
        user = await db.users.find_one({"_id": user_id})
    if not user and ObjectId.is_valid(user_id):
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user and payload.get("email"):
        user = await db.users.find_one({"email": payload.get("email").strip().lower()})
        
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user
