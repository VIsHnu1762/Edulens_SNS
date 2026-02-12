from fastapi import APIRouter, HTTPException
from app.schemas.starred import (
    StarredResponse,
    StarredItem,
    StarActionResponse
)
from app.services.starred_service import get_starred_service

router = APIRouter()


@router.get("/user/starred", response_model=StarredResponse)
async def get_starred_models(user_id: str = "default"):
    """
    Get all starred models for a user.
    
    Args:
        user_id: User identifier (default: "default")
        
    Returns:
        List of starred models with metadata
    """
    try:
        starred_service = get_starred_service()
        starred_items = starred_service.get_starred_items(user_id)
        
        return {
            "user_id": user_id,
            "starred_items": starred_items
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get starred models: {str(e)}"
        )


@router.post("/user/starred/{subject}", response_model=StarActionResponse)
async def star_model(subject: str, user_id: str = "default"):
    """
    Add a model to user's starred list.
    
    Args:
        subject: Subject/model identifier (e.g., "heart", "cell", "dna")
        user_id: User identifier (default: "default")
        
    Returns:
        Success status and message
    """
    try:
        starred_service = get_starred_service()
        result = starred_service.star_model(user_id, subject)
        
        return {
            "user_id": user_id,
            "subject": subject,
            "action": result["action"],
            "success": result["success"],
            "message": result["message"]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to star model: {str(e)}"
        )


@router.delete("/user/starred/{subject}", response_model=StarActionResponse)
async def unstar_model(subject: str, user_id: str = "default"):
    """
    Remove a model from user's starred list.
    
    Args:
        subject: Subject/model identifier (e.g., "heart", "cell", "dna")
        user_id: User identifier (default: "default")
        
    Returns:
        Success status and message
    """
    try:
        starred_service = get_starred_service()
        result = starred_service.unstar_model(user_id, subject)
        
        return {
            "user_id": user_id,
            "subject": subject,
            "action": result["action"],
            "success": result["success"],
            "message": result["message"]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to unstar model: {str(e)}"
        )


@router.get("/user/starred/check/{subject}")
async def check_starred(subject: str, user_id: str = "default"):
    """
    Check if a model is starred by user.
    
    Args:
        subject: Subject/model identifier (e.g., "heart", "cell", "dna")
        user_id: User identifier (default: "default")
        
    Returns:
        Boolean indicating if model is starred
    """
    try:
        starred_service = get_starred_service()
        is_starred = starred_service.is_starred(user_id, subject)
        
        return {
            "user_id": user_id,
            "subject": subject,
            "is_starred": is_starred
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to check starred status: {str(e)}"
        )
