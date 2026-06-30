from datetime import datetime
from fastapi import APIRouter, Depends
from app.database import complaints_collection
from app.schemas import ComplaintCreateRequest, ComplaintResponse
from app.auth import get_current_user
from app.models import complaint_doc_to_response

router = APIRouter(tags=["Complaints"])


@router.post("/complaints", response_model=ComplaintResponse, status_code=201)
async def create_complaint(
    payload: ComplaintCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    new_complaint = {
        "user_id": current_user["_id"],
        "student_name": current_user["name"],
        "department": current_user["department"],
        "title": payload.title,
        "description": payload.description,
        "status": "Pending",
        "created_at": datetime.utcnow(),
    }

    result = await complaints_collection.insert_one(new_complaint)
    new_complaint["_id"] = result.inserted_id

    return complaint_doc_to_response(new_complaint)


@router.get("/my-complaints", response_model=list[ComplaintResponse])
async def get_my_complaints(current_user: dict = Depends(get_current_user)):
    cursor = complaints_collection.find({"user_id": current_user["_id"]}).sort("created_at", -1)
    complaints = [complaint_doc_to_response(doc) async for doc in cursor]
    return complaints
