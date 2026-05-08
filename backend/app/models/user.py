from sqlalchemy import Column, Integer, String, Boolean, Enum
import enum
from app.db.session import Base

class UserCategory(str, enum.Enum):
    SCHOOL = "School / Boards"
    JEE_NEET = "JEE / NEET"
    COLLEGE = "College"
    MEDICAL = "Medical"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    category = Column(Enum(UserCategory), default=UserCategory.SCHOOL)
    is_active = Column(Boolean(), default=True)
