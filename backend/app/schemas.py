from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    
    @field_validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Story schemas
class StoryBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str
    theme: Optional[str] = None
    characters: Optional[List[str]] = None
    setting: Optional[str] = None
    age_group: Optional[str] = None
    language: str = 'en'
    is_public: bool = False

class StoryCreate(StoryBase):
    pass

class StoryResponse(StoryBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Story generation schemas
class StoryPrompt(BaseModel):
    character_type: str
    setting_type: str
    theme_type: str
    age_group: str
    language: str = 'en'
    story_length: str = 'medium'  # 'short', 'medium', 'long'
    custom_prompt: Optional[str] = None  # Optional custom instruction
    style: Optional[str] = None  # e.g., 'funny', 'scary', 'educational'
    user_id: Optional[int] = None  # Optional user ID for authentication

class StoryPromptResponse(StoryPrompt):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Saved stories schemas
class SavedStoryCreate(BaseModel):
    story_id: int
    user_id: Optional[int] = 1  # Default to user 1 if not specified

class SavedStoryResponse(BaseModel):
    id: int
    user_id: int
    story_id: int
    created_at: datetime
    story: StoryResponse
    
    class Config:
        from_attributes = True
