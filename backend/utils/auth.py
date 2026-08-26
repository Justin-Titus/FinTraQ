import os
import secrets
import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from fastapi import Response

# Configuration from environment
SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-fintraq-jwt-key-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

REFRESH_COOKIE_NAME = "rt"
REMEMBER_COOKIE_NAME = "rm"



def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt(10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash"""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create signed JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and validate JWT access token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError as e:
        raise ValueError(f"Invalid token: {str(e)}")

def generate_refresh_token_string() -> str:
    """Generate secure random string for refresh token"""
    return secrets.token_urlsafe(32)

def get_refresh_expiry(days: int = REFRESH_TOKEN_EXPIRE_DAYS) -> datetime:
    """Get UTC expiration date for refresh token"""
    return datetime.now(timezone.utc) + timedelta(days=days)

def set_refresh_cookies(response: Response, refresh_token: str, persistent: bool = True):
    """Set HttpOnly refresh cookie and remember cookie on FastAPI response"""
    is_prod = os.environ.get("NODE_ENV") == "production" or os.environ.get("SECURE_COOKIES") == "true"
    max_age = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 if persistent else None
    
    # Set Refresh Token Cookie (HttpOnly)
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        max_age=max_age,
        path="/api/auth",
        httponly=True,
        secure=is_prod,
        samesite="lax"
    )
    
    # Set Remember Flag Cookie
    if persistent:
        response.set_cookie(
            key=REMEMBER_COOKIE_NAME,
            value="1",
            max_age=max_age,
            path="/api/auth",
            httponly=False,
            secure=is_prod,
            samesite="lax"
        )
    else:
        response.delete_cookie(key=REMEMBER_COOKIE_NAME, path="/api/auth")

def clear_refresh_cookies(response: Response):
    """Delete authentication cookies"""
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path="/api/auth")
    response.delete_cookie(key=REMEMBER_COOKIE_NAME, path="/api/auth")
