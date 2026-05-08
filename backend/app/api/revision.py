from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from typing import Any, List
import datetime

from app.db.session import get_db
from app.models.revision import RevisionItem
from app.models.test import Question
from app.schemas.revision import RevisionDueItem, RevisionReviewCreate
from app.services.spaced_repetition import calculate_sm2

DEMO_USER_ID = 1

router = APIRouter()

@router.get("/due", response_model=List[RevisionDueItem])
def get_due_items(db: Session = Depends(get_db)) -> Any:
    """
    Get all revision items that are due for review today or earlier.
    """
    now = datetime.datetime.utcnow()
    
    items = db.query(RevisionItem)\
        .options(joinedload(RevisionItem.question))\
        .filter(RevisionItem.user_id == DEMO_USER_ID)\
        .filter(RevisionItem.next_review_date <= now)\
        .all()
        
    return items

@router.post("/review")
def submit_review(
    request: RevisionReviewCreate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Submit a review score (0-5) for a question.
    Updates or creates the spaced repetition item.
    """
    if request.quality < 0 or request.quality > 5:
        raise HTTPException(status_code=400, detail="Quality must be between 0 and 5")
        
    # Check if question exists
    question = db.query(Question).filter(Question.id == request.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    item = db.query(RevisionItem)\
        .filter(RevisionItem.user_id == DEMO_USER_ID)\
        .filter(RevisionItem.question_id == request.question_id)\
        .first()
        
    if not item:
        # First time reviewing this item
        item = RevisionItem(
            user_id=DEMO_USER_ID,
            question_id=request.question_id,
            ease_factor=2.5,
            interval=0,
            repetitions=0
        )
        db.add(item)
        
    # Calculate new SM-2 values
    new_reps, new_ef, new_interval = calculate_sm2(
        quality=request.quality,
        repetitions=item.repetitions,
        ease_factor=item.ease_factor,
        interval=item.interval
    )
    
    item.repetitions = new_reps
    item.ease_factor = new_ef
    item.interval = new_interval
    item.next_review_date = datetime.datetime.utcnow() + datetime.timedelta(days=new_interval)
    
    db.commit()
    db.refresh(item)
    
    return {"message": "Review recorded", "next_review_date": item.next_review_date, "interval_days": item.interval}
