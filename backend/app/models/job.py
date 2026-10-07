from sqlalchemy import Column, Integer, String, Text, JSON
from pgvector.sqlalchemy import Vector
from app.core.db import Base

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    location = Column(String)
    link = Column(String, unique=True, index=True)
    description = Column(Text)
    salary = Column(String, nullable=True)
    # Storing OpenAI text-embedding-3-small (1536 dimensions)
    embedding = Column(Vector(1536))

class UserResume(Base):
    __tablename__ = "user_resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True) # Mock single user
    parsed_json = Column(JSON)
    embedding = Column(Vector(1536))
