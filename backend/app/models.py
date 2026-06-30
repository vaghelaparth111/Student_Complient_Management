def user_doc_to_response(doc: dict) -> dict:
    # Convert a MongoDB user document into a UserResponse-friendly dict.
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "email": doc["email"],
        "department": doc["department"],
    }


def complaint_doc_to_response(doc: dict) -> dict:
    # Convert a MongoDB complaint document into a ComplaintResponse-friendly dict.
    return {
        "id": str(doc["_id"]),
        "user_id": str(doc["user_id"]),
        "student_name": doc["student_name"],
        "department": doc["department"],
        "title": doc["title"],
        "description": doc["description"],
        "status": doc["status"],
        "created_at": doc["created_at"],
    }
