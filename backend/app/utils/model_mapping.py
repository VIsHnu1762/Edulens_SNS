import sys
from pathlib import Path
from typing import Dict, Optional, Any

# Add ml_models to path
ML_MODELS_PATH = Path(__file__).parent.parent.parent.parent / "ml_models"
sys.path.insert(0, str(ML_MODELS_PATH))

from content_mapper import ContentMapper


# Initialize content mapper with metadata
CONFIG_PATH = Path(__file__).parent.parent.parent.parent / "config" / "model_metadata.json"
content_mapper = ContentMapper(metadata_path=str(CONFIG_PATH))


def get_model_path(label: str) -> str:
    """
    Map a classification label to its corresponding GLB model file path.
    
    Args:
        label: Predicted subject label
        
    Returns:
        URL path to the GLB model file
    """
    # Get model info from metadata
    model_info = content_mapper.get_model_info(label.lower())
    
    if model_info:
        filename = model_info.get('file', 'heart.glb')
    else:
        # Fallback to default
        filename = 'heart.glb'
    
    return f"/static/models/{filename}"


def get_model_metadata(label: str) -> Optional[Dict[str, Any]]:
    """
    Get complete metadata for a subject's 3D model.
    
    Args:
        label: Predicted subject label
        
    Returns:
        Dictionary with model metadata or None if not found
    """
    return content_mapper.get_model_info(label.lower())


def get_available_labels() -> list:
    """
    Get list of all available classification labels from metadata.
    
    Returns:
        List of label strings
    """
    return content_mapper.get_all_subjects()


def get_models_by_category(category: str) -> list:
    """
    Get all models in a specific subject category.
    
    Args:
        category: Subject category (e.g., 'biology', 'physics')
        
    Returns:
        List of subject names in that category
    """
    return content_mapper.get_subjects_by_category(category)


def get_related_models(label: str, limit: int = 3) -> list:
    """
    Get related models based on tags and category.
    
    Args:
        label: Subject label to find related models for
        limit: Maximum number of related models to return
        
    Returns:
        List of related subject names
    """
    return content_mapper.get_related_subjects(label.lower(), limit=limit)
