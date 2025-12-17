from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class ModelMetadata(BaseModel):
    """Metadata for 3D model"""
    display_name: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    difficulty: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    animations: Optional[List[str]] = None
    interactive_features: Optional[List[str]] = None


class AlternativePrediction(BaseModel):
    """Alternative prediction with confidence"""
    subject: str
    confidence: float


class PredictionResponse(BaseModel):
    """Response schema for image classification predictions"""
    predicted_subject: str
    confidence: float
    model_path: str
    metadata: Optional[ModelMetadata] = None
    alternatives: Optional[List[AlternativePrediction]] = None
    related_models: Optional[List[str]] = None


class HealthResponse(BaseModel):
    """Response schema for health check"""
    status: str
    message: str


class ErrorResponse(BaseModel):
    """Response schema for errors"""
    detail: str
