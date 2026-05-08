from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List

from app.db.session import get_db
from app.models.test import Assessment, Question
from app.schemas.test import TestGenerationRequest, Assessment as AssessmentSchema, AssessmentCreate, QuestionCreate
from app.services.test_generation import generate_assessment_from_material

# For demo purposes, we are simulating the authenticated user ID
# In production, use Depends(get_current_user)
DEMO_USER_ID = 1

router = APIRouter()

@router.post("/generate", response_model=AssessmentSchema)
def generate_and_save_test(
    request: TestGenerationRequest,
    db: Session = Depends(get_db)
) -> Any:
    """
    Generate an assessment via LLM based on study material, and save it to the database.
    """
    # 1. Generate questions
    generated_data = generate_assessment_from_material(
        study_material=request.study_material,
        topic=request.topic,
        difficulty=request.difficulty,
        types=request.types,
        count=request.count
    )
    
    if not generated_data:
        raise HTTPException(status_code=500, detail="Failed to generate questions")

    # 2. Save Assessment
    db_assessment = Assessment(
        user_id=DEMO_USER_ID,
        topic=request.topic,
        difficulty=request.difficulty
    )
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    
    # 3. Save Questions
    db_questions = []
    for q_data in generated_data:
        db_question = Question(
            assessment_id=db_assessment.id,
            question_type=q_data["question_type"],
            content=q_data["content"],
            options=q_data.get("options"),
            correct_answer=q_data["correct_answer"]
        )
        db.add(db_question)
        db_questions.append(db_question)
        
    db.commit()
    
    # Return the assessment with questions (using relationships)
    db.refresh(db_assessment)
    return db_assessment

@router.get("/{assessment_id}", response_model=AssessmentSchema)
def get_assessment(
    assessment_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve an assessment by ID.
    """
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment
