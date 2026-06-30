from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from bson import ObjectId
from bson.errors import InvalidId

from app.config import JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from app.database import users_collection

# Tells FastAPI/Swagger where the login endpoint is (for the "Authorize" button)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def create_access_token(data: dict) -> str:
    # Create a signed JWT containing the given payload plus an expiry.
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    # Decode and validate a JWT. Raises JWTError if invalid/expired.
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
    except InvalidId:
        raise credentials_exception

    if user is None:
        raise credentials_exception

    return user
