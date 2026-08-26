from fastapi import APIRouter, HTTPException, Depends, Request, Response, status
from typing import Any
from datetime import datetime, timezone
from models.user import UserCreate, UserLogin, UserInDB, UserResponse, RefreshTokenEntry
from utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    generate_refresh_token_string,
    get_refresh_expiry,
    set_refresh_cookies,
    clear_refresh_cookies,
    REFRESH_COOKIE_NAME,
    REMEMBER_COOKIE_NAME
)
from database import get_database
from dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    response: Response,
    request: Request,
    db: Any = Depends(get_database)
):
    """Register a new user account"""
    email_clean = user_in.email.strip().lower()
    
    # Check if email exists
    existing = await db.users.find_one({"email": email_clean})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Hash password & construct user record
    hashed_pwd = hash_password(user_in.password)
    refresh_token = generate_refresh_token_string()
    refresh_entry = RefreshTokenEntry(
        token=refresh_token,
        expires_at=get_refresh_expiry(),
        user_agent=request.headers.get("user-agent"),
        ip=request.client.host if request.client else None
    )
    
    user_db = UserInDB(
        name=user_in.name.strip(),
        email=email_clean,
        hashed_password=hashed_pwd,
        refresh_tokens=[refresh_entry]
    )
    
    user_dict = user_db.dict()
    # Convert datetime objects in refresh_tokens list to ISO strings or datetime objects for Motor
    await db.users.insert_one(user_dict)
    
    # Set Refresh Cookies (default remember=True on register)
    set_refresh_cookies(response, refresh_token, persistent=True)
    
    # Generate Access Token
    access_token = create_access_token(data={"sub": user_db.id, "email": user_db.email, "role": user_db.role})
    
    user_resp = UserResponse(
        id=user_db.id,
        name=user_db.name,
        email=user_db.email,
        role=user_db.role,
        created_at=user_db.created_at
    )
    return {"user": user_resp.dict(), "accessToken": access_token}

@router.post("/login")
async def login(
    credentials: UserLogin,
    response: Response,
    request: Request,
    db: Any = Depends(get_database)
):
    """Authenticate user with email and password"""
    email_clean = credentials.email.strip().lower()
    
    user = await db.users.find_one({"email": email_clean})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    stored_hash = user.get("hashed_password") or user.get("password")
    
    if not stored_hash or not verify_password(credentials.password, stored_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Prune expired refresh tokens & add new refresh token
    now = datetime.now(timezone.utc)
    existing_tokens = user.get("refresh_tokens", [])
    valid_tokens = []
    for rt in existing_tokens:
        expires = rt.get("expires_at")
        if isinstance(expires, str):
            expires = datetime.fromisoformat(expires)
        if expires and expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        if expires and expires > now:
            valid_tokens.append(rt)
            
    new_refresh_token = generate_refresh_token_string()
    new_entry = RefreshTokenEntry(
        token=new_refresh_token,
        expires_at=get_refresh_expiry(),
        user_agent=request.headers.get("user-agent"),
        ip=request.client.host if request.client else None
    ).dict()
    
    valid_tokens.append(new_entry)
    
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"refresh_tokens": valid_tokens}}
    )
    
    # Set Cookies
    set_refresh_cookies(response, new_refresh_token, persistent=credentials.remember)
    
    # Issue Access Token
    user_id = user.get("id") or str(user.get("_id"))
    access_token = create_access_token(data={"sub": user_id, "email": user["email"], "role": user.get("role", "user")})
    
    user_resp = UserResponse(
        id=user_id,
        name=user["name"],
        email=user["email"],
        role=user.get("role", "user")
    )
    return {"user": user_resp.dict(), "accessToken": access_token}

@router.post("/refresh-token")
async def refresh_token(
    request: Request,
    response: Response,
    db: Any = Depends(get_database)
):
    """Silent token refresh via HttpOnly refresh cookie with token rotation"""
    token_str = request.cookies.get(REFRESH_COOKIE_NAME)
    if not token_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token"
        )
    
    user = await db.users.find_one({"refresh_tokens.token": token_str})
    if not user:
        clear_refresh_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    now = datetime.now(timezone.utc)
    tokens = user.get("refresh_tokens", [])
    matching_token = None
    remaining_tokens = []
    
    for t in tokens:
        if t.get("token") == token_str:
            matching_token = t
        else:
            remaining_tokens.append(t)
            
    if not matching_token:
        clear_refresh_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
        
    expires = matching_token.get("expires_at")
    if isinstance(expires, str):
        expires = datetime.fromisoformat(expires)
    if expires and expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
        
    if expires and expires <= now:
        await db.users.update_one({"_id": user["_id"]}, {"$set": {"refresh_tokens": remaining_tokens}})
        clear_refresh_cookies(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Expired refresh token"
        )
    
    # Token Rotation: Issue new refresh token
    new_refresh_token = generate_refresh_token_string()
    new_entry = RefreshTokenEntry(
        token=new_refresh_token,
        expires_at=get_refresh_expiry(),
        user_agent=request.headers.get("user-agent"),
        ip=request.client.host if request.client else None
    ).dict()
    
    remaining_tokens.append(new_entry)
    await db.users.update_one({"_id": user["_id"]}, {"$set": {"refresh_tokens": remaining_tokens}})
    
    # Preserve persistence preference
    remember_flag = request.cookies.get(REMEMBER_COOKIE_NAME) == "1"
    set_refresh_cookies(response, new_refresh_token, persistent=remember_flag)
    
    user_id = user.get("id") or str(user.get("_id"))
    access_token = create_access_token(data={"sub": user_id, "email": user["email"], "role": user.get("role", "user")})
    
    return {"accessToken": access_token}

@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: Any = Depends(get_database)
):
    """Revoke refresh token and clear auth cookies"""
    token_str = request.cookies.get(REFRESH_COOKIE_NAME)
    if token_str:
        await db.users.update_one(
            {"refresh_tokens.token": token_str},
            {"$pull": {"refresh_tokens": {"token": token_str}}}
        )
    clear_refresh_cookies(response)
    return {"message": "Logged out"}

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Return authenticated current user info"""
    user_id = current_user.get("id") or str(current_user.get("_id"))
    user_resp = UserResponse(
        id=user_id,
        name=current_user["name"],
        email=current_user["email"],
        role=current_user.get("role", "user")
    )
    return {"user": user_resp.dict()}
