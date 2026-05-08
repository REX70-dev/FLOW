from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.models.test import QuestionType

class QuestionBase(BaseModel):
    question_type: QuestionType
    content: str
    options: Optional[List[str]] = None
    correct_answer: str

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    assessment_id: int

    class Config:
        from_attributes = True

class AssessmentBase(BaseModel):
    topic: str
    difficulty: str

class AssessmentCreate(AssessmentBase):
    questions: List[QuestionCreate]

class Assessment(AssessmentBase):
    id: int
    user_id: int
    questions: List[Question] = []

    class Config:
        from_attributes = True

class TestGenerationRequest(BaseModel):
    study_material: str
    topic: str
    difficulty: str = "medium"
    types: List[QuestionType] = [QuestionType.MCQ, QuestionType.FLASHCARD]
    count: int = 5
