from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import io

from app.schemas.responses import PredictionResponse
from app.utils.file_validation import validate_file_type, validate_file_size
from app.utils.clip_inference import get_classifier
from app.utils.model_mapping import get_model_path, get_model_metadata, get_related_models

router = APIRouter()


@router.post("/upload-image", response_model=PredictionResponse)
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image and get a predicted 3D model based on CLIP classification.
    
    Args:
        file: Uploaded image file (PNG/JPG/JPEG)
        
    Returns:
        PredictionResponse with predicted subject, confidence, model path, and metadata
        
    Raises:
        HTTPException: If file validation fails or processing error occurs
    """
    # Validate file type
    validate_file_type(file.filename)
    
    # Read file contents
    try:
        contents = await file.read()
        validate_file_size(len(contents))
        
        # Load image with Pillow
        image = Image.open(io.BytesIO(contents))
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process image: {str(e)}"
        )
    
    # Get CLIP classifier and classify image with detailed results
    try:
        classifier = get_classifier()
        result = classifier.classify_image_detailed(image, top_k=3)
        
        predicted_label = result['predicted_subject']
        confidence = result['confidence']
        top_predictions = result.get('top_predictions', [])
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Classification failed: {str(e)}"
        )
    
    # Map label to 3D model path and get metadata
    model_path = get_model_path(predicted_label)
    model_metadata = get_model_metadata(predicted_label)
    related_models = get_related_models(predicted_label, limit=3)
    
    response = {
        "predicted_subject": predicted_label,
        "confidence": round(confidence, 4),
        "model_path": model_path
    }
    
    # Add metadata if available
    if model_metadata:
        response["metadata"] = {
            "display_name": model_metadata.get("display_name"),
            "category": model_metadata.get("subject_category"),
            "subcategory": model_metadata.get("subcategory"),
            "difficulty": model_metadata.get("difficulty_level"),
            "description": model_metadata.get("description"),
            "tags": model_metadata.get("educational_tags", []),
            "animations": model_metadata.get("animations", []),
            "interactive_features": model_metadata.get("interactive_features", [])
        }
    
    # Add alternative predictions
    if top_predictions and len(top_predictions) > 1:
        response["alternatives"] = [
            {
                "subject": pred["subject"],
                "confidence": round(pred["score"], 4)
            }
            for pred in top_predictions[1:]  # Skip first (already in predicted_subject)
        ]
    
    # Add related models
    if related_models:
        response["related_models"] = related_models
    
    return response
