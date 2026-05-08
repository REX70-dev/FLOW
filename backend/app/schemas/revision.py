from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.test import Question

class RevisionItemBase(BaseModel):
    user_id: int
    question_id: int

class RevisionReviewCreate(BaseModel):
    question_id: int
    quality: int # 0 to 5 based on SM-2

class RevisionItem(RevisionItemBase):
    id: int
    ease_factor: float
    interval: int
    repetitions: int
    next_review_date: datetime
    
    class Config:
        from_attributes = True

# Response model when fetching due items, includes the question content
class RevisionDueItem(RevisionItem):
    question: Question
