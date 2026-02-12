"""
Service for managing starred/favorite models
"""
from typing import List, Dict
from datetime import datetime
from app.utils.storage import get_storage
import json
import os


class StarredService:
    """Manages user's starred/favorite models"""
    
    def __init__(self, data_file: str = "starred.json"):
        self.data_file = data_file
        self.storage = get_storage()
        # Load model metadata for display names
        self.metadata_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "..",
            "config",
            "model_metadata.json"
        )
    
    def _get_model_info(self, subject: str) -> Dict:
        """Get model metadata from config"""
        try:
            with open(self.metadata_path, 'r') as f:
                metadata = json.load(f)
                subjects = metadata.get('subjects', {})
                return subjects.get(subject, {})
        except Exception as e:
            print(f"Error loading metadata from {self.metadata_path}: {e}")
            return {}
    
    def get_starred_items(self, user_id: str = "default") -> List[Dict]:
        """Get all starred items for a user"""
        try:
            data = self.storage.read(self.data_file, default={})
            if user_id not in data:
                data[user_id] = {"starred_models": []}
                self.storage.write(self.data_file, data)
            
            return data[user_id].get("starred_models", [])
        except Exception as e:
            print(f"Error getting starred items for user {user_id}: {e}")
            return []
    
    def star_model(self, user_id: str, subject: str) -> Dict:
        """Add a model to starred list"""
        try:
            data = self.storage.read(self.data_file, default={})
            
            # Initialize user data if not exists
            if user_id not in data:
                data[user_id] = {"starred_models": []}
            
            starred_list = data[user_id].get("starred_models", [])
            
            # Check if already starred
            if any(item["subject"] == subject for item in starred_list):
                return {
                    "success": False,
                    "message": "Model already starred",
                    "action": "already_starred"
                }
            
            # Get model info
            model_info = self._get_model_info(subject)
            
            # Add to starred list
            starred_item = {
                "subject": subject,
                "display_name": model_info.get("display_name", subject.replace("_", " ").title()),
                "starred_at": datetime.utcnow().isoformat(),
                "category": model_info.get("subject_category", "general")
            }
            
            starred_list.append(starred_item)
            data[user_id]["starred_models"] = starred_list
            
            self.storage.write(self.data_file, data)
            
            return {
                "success": True,
                "message": f"Successfully starred {starred_item['display_name']}",
                "action": "starred"
            }
            
        except Exception as e:
            print(f"Error starring model {subject} for user {user_id}: {e}")
            return {
                "success": False,
                "message": f"Failed to star model: {str(e)}",
                "action": "error"
            }
    
    def unstar_model(self, user_id: str, subject: str) -> Dict:
        """Remove a model from starred list"""
        try:
            data = self.storage.read(self.data_file, default={})
            
            if user_id not in data:
                return {
                    "success": False,
                    "message": "User has no starred models",
                    "action": "not_found"
                }
            
            starred_list = data[user_id].get("starred_models", [])
            
            # Find and remove the item
            original_length = len(starred_list)
            starred_list = [
                item for item in starred_list 
                if item["subject"] != subject
            ]
            
            if len(starred_list) == original_length:
                return {
                    "success": False,
                    "message": "Model not found in starred list",
                    "action": "not_found"
                }
            
            data[user_id]["starred_models"] = starred_list
            self.storage.write(self.data_file, data)
            
            return {
                "success": True,
                "message": f"Successfully unstarred {subject}",
                "action": "unstarred"
            }
            
        except Exception as e:
            print(f"Error unstarring model {subject} for user {user_id}: {e}")
            return {
                "success": False,
                "message": f"Failed to unstar model: {str(e)}",
                "action": "error"
            }
    
    def is_starred(self, user_id: str, subject: str) -> bool:
        """Check if a model is starred by user"""
        starred_list = self.get_starred_items(user_id)
        return any(item["subject"] == subject for item in starred_list)


# Singleton instance
_starred_service = None


def get_starred_service() -> StarredService:
    """Get or create the starred service singleton"""
    global _starred_service
    if _starred_service is None:
        _starred_service = StarredService()
    return _starred_service
