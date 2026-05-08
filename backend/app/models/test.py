from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
import enum
from app.db.session import Base

class QuestionType(str, enum.Enum):
    MCQ = "MCQ"
    SUBJECTIVE = "SUBJECTIVE"
    FLASHCARD = "FLASHCARD"

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String, index=True)
    difficulty = Column(String)
    
    # Relationship to user and questions
    user = relationship("User")
    questions = relationship("Question", back_populates="assessment", cascade="all, delete")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    question_type = Column(Enum(QuestionType), nullable=False)
    content = Column(String, nullable=False)
    
    # Using JSON for options (for MCQ) or extra metadata
    options = Column(JSON, nullable=True) 
    correct_answer = Column(String, nullable=False)
    
    assessment = relationship("Assessment", back_populates="questions")
