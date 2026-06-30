from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, HTTPException

from app.database import complaints_collection
from app.schemas import ComplaintResponse, ComplaintStatusUpdateRequest
from app.models import complaint_doc_to_response

router = APIRouter(prefix="/admin", tags=["Admin"])

def _to_object_id(complaint_id: str) -> ObjectId:
    try:
        return ObjectId(complaint_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid complaint id")


@router.get("/complaints", response_model=list[ComplaintResponse])
async def get_all_complaints():
    cursor = complaints_collection.find({}).sort("created_at", -1)
    complaints = [complaint_doc_to_response(doc) async for doc in cursor]
    return complaints


@router.put("/complaints/{complaint_id}", response_model=ComplaintResponse)
async def update_complaint_status(complaint_id: str, payload: ComplaintStatusUpdateRequest):
    obj_id = _to_object_id(complaint_id)

    result = await complaints_collection.find_one_and_update(
        {"_id": obj_id},
        {"$set": {"status": payload.status}},
        return_document=True,
    )

    if result is None:
        raise HTTPException(status_code=404, detail="Complaint not found")

    return complaint_doc_to_response(result)


@router.delete("/complaints/{complaint_id}", status_code=204)
async def delete_complaint(complaint_id: str):
    obj_id = _to_object_id(complaint_id)

    result = await complaints_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")

    return None
