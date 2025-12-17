import sys
from pathlib import Path
from typing import Tuple, Dict
from PIL import Image

# Add ml_models to path
ML_MODELS_PATH = Path(__file__).parent.parent.parent.parent / "ml_models"
sys.path.insert(0, str(ML_MODELS_PATH))

from classify import EducationalSubjectClassifier


class CLIPClassifier:
    """
    CLIP-based image classifier for educational subjects.
    Uses the enhanced ml_models classifier with extended subject taxonomy.
    """
    
    def __init__(self):
        """Initialize the educational subject classifier."""
        print("Initializing educational subject classifier...")
        self.classifier = EducationalSubjectClassifier()
        
        # Get available labels from classifier
        self.labels = list(self.classifier.LABEL_TO_SUBJECT.values())
        print(f"Classifier ready with {len(self.labels)} subjects")
    
    def classify_image(self, image: Image.Image) -> Tuple[str, float]:
        """
        Classify an image and return the predicted label with confidence.
        
        Args:
            image: PIL Image object
            
        Returns:
            Tuple of (predicted_label, confidence_score)
        """
        # Ensure image is in RGB mode
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Save temporary image for classification
        import tempfile
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            image.save(tmp.name)
            tmp_path = tmp.name
        
        try:
            # Classify using ml_models classifier
            result = self.classifier.classify_image(tmp_path, top_k=1)
            predicted_subject = result['predicted_subject']
            confidence = result['confidence']
            
            return predicted_subject, confidence
        finally:
            # Clean up temp file
            import os
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    def classify_image_detailed(self, image: Image.Image, top_k: int = 3) -> Dict:
        """
        Classify an image and return detailed results with top predictions.
        
        Args:
            image: PIL Image object
            top_k: Number of top predictions to return
            
        Returns:
            Dictionary with predicted_subject, confidence, and top_predictions
        """
        # Ensure image is in RGB mode
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Save temporary image for classification
        import tempfile
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            image.save(tmp.name)
            tmp_path = tmp.name
        
        try:
            # Classify using ml_models classifier
            result = self.classifier.classify_image(tmp_path, top_k=top_k)
            return result
        finally:
            # Clean up temp file
            import os
            if os.path.exists(tmp_path):
                os.remove(tmp_path)


# Global classifier instance (initialized at startup)
_classifier: CLIPClassifier = None


def initialize_classifier():
    """Initialize the global CLIP classifier instance."""
    global _classifier
    if _classifier is None:
        _classifier = CLIPClassifier()


def get_classifier() -> CLIPClassifier:
    """
    Get the global CLIP classifier instance.
    
    Returns:
        CLIPClassifier instance
        
    Raises:
        RuntimeError: If classifier hasn't been initialized
    """
    if _classifier is None:
        raise RuntimeError("CLIP classifier not initialized. Call initialize_classifier() first.")
    return _classifier
