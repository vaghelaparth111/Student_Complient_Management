from fastapi import APIRouter, HTTPException, status
from app.database import users_collection
from app.schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.utils import hash_password, verify_password
from app.auth import create_access_token
from app.models import user_doc_to_response

router = APIRouter(tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest):
    # Confirm the two password fields match
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Check for duplicate email
    existing_user = await users_collection.find_one({"email": payload.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Hash the password before storing
    hashed_pw = hash_password(payload.password)

    new_user = {
        "name": payload.name,
        "email": payload.email,
        "department": payload.department,
        "password": hashed_pw,
    }

    result = await users_collection.insert_one(new_user)
    new_user["_id"] = result.inserted_id

    return user_doc_to_response(new_user)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    user = await users_collection.find_one({"email": payload.email})

    # Use a generic error message so we don't reveal whether the email exists
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": str(user["_id"])})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_doc_to_response(user),
    }
