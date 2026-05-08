from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.db.session import Base

class RevisionItem(Base):
    __tablename__ = "revision_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    
    # SM-2 Metrics
    ease_factor = Column(Float, default=2.5)
    interval = Column(Integer, default=0) # Days
    repetitions = Column(Integer, default=0)
    
    next_review_date = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    user = relationship("User")
    question = relationship("Question")
