import os
import hashlib
import secrets
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
import openai
import http.client
import json
from datetime import datetime
import random

from .schemas import (
    UserCreate, UserLogin, UserResponse, 
    StoryCreate, StoryResponse, StoryPrompt, 
    StoryPromptResponse, SavedStoryCreate, SavedStoryResponse
)

app = FastAPI(title="StoryTeller AI API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default port
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI API
openai.api_key = os.getenv("OPENAI_API_KEY")
print(f"OpenAI API key loaded: {openai.api_key[:5]}...")  # Print first few chars for debug

# Direct HTTP request function for more control
def openai_chat_completion(messages, max_tokens=2000):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OpenAI API key is not set")
    
    print(f"Using API key: {api_key[:5]}...")
    
    # Correct headers according to OpenAI docs
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    # Payload format according to docs
    payload = json.dumps({
        "model": "gpt-3.5-turbo",
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": 0.7,
        "n": 1,  # Number of completions to generate
        "stream": False  # Don't stream the response
    })
    
    try:
        conn = http.client.HTTPSConnection("api.openai.com")
        conn.request("POST", "/v1/chat/completions", payload, headers)
        response = conn.getresponse()
        
        print(f"OpenAI API status: {response.status}")
        
        data = response.read().decode("utf-8")
        conn.close()
        
        if response.status != 200:
            print(f"OpenAI API error response: {data}")
            error_data = json.loads(data)
            error_message = error_data.get('error', {}).get('message', 'Unknown error')
            raise Exception(f"OpenAI API error: {error_message}")
        
        # Parse and return the response
        response_data = json.loads(data)
        print(f"API response received, model: {response_data.get('model')}")
        return response_data
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        raise

# Database connection helper
def get_db_connection():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    conn.autocommit = False
    return conn

# Helper to generate a story with AI
async def generate_story_with_ai(prompt: StoryPrompt):
    # Define age-appropriate language
    age_map = {
        "3-5": "very simple language suitable for preschoolers",
        "6-8": "simple language suitable for early elementary school children",
        "9-12": "language suitable for upper elementary school children"
    }
    
    # Define length parameters
    length_map = {
        "short": "at least 1000 words",
        "medium": "at least 1500 words",
        "long": "at least 2500 words"
    }
    
    age_language = age_map.get(prompt.age_group, "simple language suitable for children")
    story_length = length_map.get(prompt.story_length, "at least 1500 words")
    
    # Build the base prompt
    if prompt.language.lower() == 'sv':
        system_message = f"""Du är en kreativ barnboksförfattare. 
        Skriv en LÅNG saga på svenska med {age_language}.
        Sagan ska vara {story_length} lång.
        Sagan ska handla om en {prompt.character_type} i en {prompt.setting_type} med temat {prompt.theme_type}.
        Sagan ska vara underhållande, lärorik och lämplig för barn i åldern {prompt.age_group}.
        Dela upp berättelsen i korta stycken."""
    else:
        system_message = f"""You are a creative children's book author. 
        Write a LONG story in English with {age_language}.
        The story should be {story_length} long.
        The story should be about a {prompt.character_type} in a {prompt.setting_type} with the theme of {prompt.theme_type}.
        The story should be entertaining, educational, and appropriate for children aged {prompt.age_group}.
        Break the story into short paragraphs."""
    
    # Add style instruction if provided
    if prompt.style:
        if prompt.language.lower() == 'sv':
            system_message += f"\nSagan ska vara i en {prompt.style} stil."
        else:
            system_message += f"\nThe story should be in a {prompt.style} style."
    
    # Add custom prompt if provided
    if prompt.custom_prompt:
        system_message += f"\n{prompt.custom_prompt}"
    
    try:
        print(f"Starting story generation for {prompt.character_type} in {prompt.setting_type}")
        api_key = os.getenv("OPENAI_API_KEY")
        print(f"API Key exists: {bool(api_key)}, length: {len(api_key) if api_key else 0}")
        
        try:
            # Use direct HTTP method for more control and better debugging
            messages = [
                {"role": "system", "content": system_message},
                {"role": "user", "content": f"Write a story about a {prompt.character_type} in a {prompt.setting_type} with the theme of {prompt.theme_type}."}
            ]
            
            # Call with more tokens for longer stories
            response = openai_chat_completion(messages, max_tokens=4000)
            
            print("OpenAI API response received successfully")
            
            # Extract story text from the JSON response according to docs
            if "choices" in response and len(response["choices"]) > 0:
                choice = response["choices"][0]
                if "message" in choice and "content" in choice["message"]:
                    story_text = choice["message"]["content"].strip()
                    print(f"Story content extracted, length: {len(story_text)} characters")
                else:
                    raise Exception("Unexpected response format: 'message' or 'content' not found in response")
            else:
                raise Exception("Unexpected response format: 'choices' not found or empty in response")
            
            # Generate a simple title
            title = f"The {prompt.character_type} in the {prompt.setting_type}"
            if prompt.language.lower() == 'sv':
                title = f"{prompt.character_type}en i {prompt.setting_type}en"
            
            return {
                "title": title,
                "content": story_text,
                "characters": [prompt.character_type],
                "setting": prompt.setting_type,
                "theme": prompt.theme_type,
                "age_group": prompt.age_group,
                "language": prompt.language,
                "story_length": prompt.story_length,
                "style": prompt.style
            }
            
        except Exception as api_err:
            print(f"OpenAI API error details: {type(api_err).__name__}: {str(api_err)}")
            raise
            
    except Exception as e:
        print(f"Detailed error generating story: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Create a more detailed fallback story based on the parameters
        if prompt.language.lower() == 'sv':
            fallback_title = f"{prompt.character_type}en i {prompt.setting_type}en"
            fallback_story = f"""Det var en gång en modig {prompt.character_type} som bodde i en fantastisk {prompt.setting_type}. 
            
Varje dag utforskade {prompt.character_type}en nya platser och lärde sig nya saker.

En dag upptäckte {prompt.character_type}en något speciellt som handlade om {prompt.theme_type}.

Detta lärde {prompt.character_type}en något viktigt om världen och sig själv.

Alla i {prompt.setting_type}en blev glada och firade tillsammans.

Slut."""
        else:
            fallback_title = f"The {prompt.character_type} in the {prompt.setting_type}"
            fallback_story = f"""Once upon a time, there was a brave {prompt.character_type} who lived in an amazing {prompt.setting_type}.
            
Every day, the {prompt.character_type} would explore new places and learn new things.

One day, the {prompt.character_type} discovered something special about {prompt.theme_type}.

This taught the {prompt.character_type} something important about the world and themselves.

Everyone in the {prompt.setting_type} was happy and celebrated together.

The end."""
            
        return {
            "title": fallback_title,
            "content": fallback_story,
            "characters": [prompt.character_type],
            "setting": prompt.setting_type,
            "theme": prompt.theme_type,
            "age_group": prompt.age_group,
            "language": prompt.language,
            "story_length": prompt.story_length,
            "style": prompt.style,
            "is_fallback": True  # Flag to indicate this is a fallback story
        }

# Get available story prompts
@app.get("/api/story-prompts", response_model=List[StoryPromptResponse])
async def get_story_prompts(language: Optional[str] = None, age_group: Optional[str] = None):
    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                query = "SELECT * FROM story_prompts"
                params = []
                
                if language or age_group:
                    query += " WHERE"
                    
                    if language:
                        query += " language = %s"
                        params.append(language)
                        
                    if language and age_group:
                        query += " AND"
                        
                    if age_group:
                        query += " age_group = %s"
                        params.append(age_group)
                
                cursor.execute(query, params)
                result = cursor.fetchall()
                return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Generate a story
@app.post("/api/generate-story", response_model=StoryResponse)
async def generate_story(
    prompt: StoryPrompt,
    background_tasks: BackgroundTasks,
    user_id: Optional[int] = None
):
    # If user_id is not provided in the request body, extract it from the prompt dict
    prompt_dict = prompt.dict()
    if user_id is None and 'user_id' in prompt_dict:
        user_id = prompt_dict.get('user_id')
    
    # Verify user exists if user_id is provided and not None
    conn = get_db_connection()
    try:
        if user_id is not None:
            with conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                    cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
                    user = cursor.fetchone()
                    if not user:
                        user_id = None  # Reset to None if invalid user_id
        
        # Generate story with AI
        story_data = await generate_story_with_ai(prompt)
        
        # Create story object
        story = StoryCreate(
            title=story_data["title"],
            content=story_data["content"],
            theme=story_data["theme"],
            characters=story_data["characters"],
            setting=story_data["setting"],
            age_group=story_data["age_group"],
            language=story_data["language"],
            is_public=True if user_id is None else False  # Make stories public if no user
        )
        
        # Save story to database
        with conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                query = """
                INSERT INTO stories 
                (title, content, theme, characters, setting, age_group, language, user_id, is_public)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, created_at, updated_at
                """
                cursor.execute(
                    query, 
                    (
                        story.title, 
                        story.content, 
                        story.theme, 
                        story.characters, 
                        story.setting, 
                        story.age_group, 
                        story.language, 
                        user_id, 
                        story.is_public
                    )
                )
                result = cursor.fetchone()
                
                # Combine the result with the story data
                response = {**story_data, "id": result["id"], "user_id": user_id, 
                           "created_at": result["created_at"], "updated_at": result["updated_at"]}
                return response
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Get stories
@app.get("/api/stories", response_model=List[StoryResponse])
async def get_stories(user_id: Optional[int] = None, is_public: Optional[bool] = None):
    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                query = "SELECT * FROM stories"
                params = []
                
                if user_id is not None or is_public is not None:
                    query += " WHERE"
                    
                    if user_id is not None:
                        query += " user_id = %s"
                        params.append(user_id)
                        
                    if user_id is not None and is_public is not None:
                        query += " AND"
                        
                    if is_public is not None:
                        query += " is_public = %s"
                        params.append(is_public)
                
                query += " ORDER BY created_at DESC"
                cursor.execute(query, params)
                result = cursor.fetchall()
                return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Get a specific story
@app.get("/api/stories/{story_id}", response_model=StoryResponse)
async def get_story(story_id: int):
    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT * FROM stories WHERE id = %s", (story_id,))
                result = cursor.fetchone()
                if not result:
                    raise HTTPException(status_code=404, detail="Story not found")
                return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Save a story
@app.post("/api/saved-stories", response_model=SavedStoryResponse)
async def save_story(saved_story: SavedStoryCreate):
    # Extract user_id from request body if present, otherwise use default
    user_id = getattr(saved_story, 'user_id', 1)
    
    print(f"Saving story: Story ID: {saved_story.story_id}, User ID: {user_id}")
    
    conn = get_db_connection()
    try:
        with conn:
            # First check if the story exists
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT * FROM stories WHERE id = %s", (saved_story.story_id,))
                story = cursor.fetchone()
                if not story:
                    raise HTTPException(status_code=404, detail=f"Story not found with ID: {saved_story.story_id}")
                
                # Then check if it's already saved
                cursor.execute(
                    "SELECT * FROM saved_stories WHERE user_id = %s AND story_id = %s", 
                    (user_id, saved_story.story_id)
                )
                existing = cursor.fetchone()
                if existing:
                    raise HTTPException(
                        status_code=400, 
                        detail="Story already saved by this user"
                    )
                
                # Save the story
                cursor.execute(
                    "INSERT INTO saved_stories (user_id, story_id) VALUES (%s, %s) RETURNING id, created_at", 
                    (user_id, saved_story.story_id)
                )
                result = cursor.fetchone()
                
                # Return saved story with the related story
                return {
                    "id": result["id"],
                    "user_id": user_id,
                    "story_id": saved_story.story_id,
                    "created_at": result["created_at"],
                    "story": story
                }
    except HTTPException as e:
        conn.rollback()
        raise e
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.on_event("startup")
async def startup_event():
    """Runs when the server starts"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("WARNING: No OpenAI API key found in environment variables!")
    else:
        print(f"OpenAI API key loaded, length: {len(api_key)} chars")
        
    # Test database connection
    try:
        conn = get_db_connection()
        with conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1")
        print("Database connection successful")
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    # Check if API key exists
    api_key_status = "available" if os.getenv("OPENAI_API_KEY") else "missing"
    
    return {
        "status": "ok", 
        "timestamp": datetime.now().isoformat(),
        "openai_api": api_key_status
    }

@app.post("/api/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    # Hash the password securely
    salt = secrets.token_hex(16)
    hashed_password = hashlib.sha256(f"{user.password}{salt}".encode()).hexdigest()
    
    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                # Check if email already exists
                cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
                if cursor.fetchone():
                    raise HTTPException(status_code=400, detail="Email already registered")
                
                # Check if username already exists
                cursor.execute("SELECT id FROM users WHERE username = %s", (user.username,))
                if cursor.fetchone():
                    raise HTTPException(status_code=400, detail="Username already taken")
                
                # Create new user
                cursor.execute(
                    """
                    INSERT INTO users (username, email, password_hash) 
                    VALUES (%s, %s, %s) 
                    RETURNING id, username, email, created_at
                    """,
                    (user.username, user.email, f"{salt}:{hashed_password}")
                )
                new_user = cursor.fetchone()
                
                # Return the user without the password
                return {
                    "id": new_user["id"],
                    "username": new_user["username"],
                    "email": new_user["email"],
                    "created_at": new_user["created_at"]
                }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.post("/api/login")
async def login_user(user_login: UserLogin):
    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                # Get user by email
                cursor.execute("SELECT id, username, email, password_hash, created_at FROM users WHERE email = %s", 
                              (user_login.email,))
                user = cursor.fetchone()
                
                if not user:
                    raise HTTPException(
                        status_code=401, 
                        detail="Invalid email or password"
                    )
                
                # Verify password
                salt, stored_hash = user["password_hash"].split(":")
                computed_hash = hashlib.sha256(f"{user_login.password}{salt}".encode()).hexdigest()
                
                if computed_hash != stored_hash:
                    raise HTTPException(
                        status_code=401, 
                        detail="Invalid email or password"
                    )
                
                # Return user info without password
                return {
                    "id": user["id"],
                    "username": user["username"],
                    "email": user["email"],
                    "created_at": user["created_at"]
                }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
