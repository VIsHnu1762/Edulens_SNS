from pydantic import BaseModel
from typing import List, Optional


class StarredItem(BaseModel):
    """Schema for a starred model/subject"""
    subject: str
    display_name: str
    starred_at: str
    category: Optional[str] = None


class StarredResponse(BaseModel):
    """Response schema for starred items"""
    user_id: str
    starred_items: List[StarredItem]


class StarActionResponse(BaseModel):
    """Response schema for star/unstar actions"""
    user_id: str
    subject: str
    action: str  # "starred" or "unstarred"
    success: bool
    message: str
