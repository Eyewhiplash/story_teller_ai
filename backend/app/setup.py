import time
import os
import psycopg2

def create_tables():
    """Create database tables if they don't exist"""
    commands = (
        """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS stories (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            theme VARCHAR(100),
            characters TEXT[],
            setting VARCHAR(100),
            age_group VARCHAR(50),
            language VARCHAR(10),
            user_id INTEGER REFERENCES users(id),
            is_public BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS story_prompts (
            id SERIAL PRIMARY KEY,
            character_type VARCHAR(100) NOT NULL,
            setting_type VARCHAR(100) NOT NULL,
            theme_type VARCHAR(100) NOT NULL,
            age_group VARCHAR(50) NOT NULL,
            language VARCHAR(10) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS saved_stories (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            story_id INTEGER REFERENCES stories(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, story_id)
        )
        """
    )
    
    conn = psycopg2.connect(
        os.environ.get("DATABASE_URL")
    )
    
    try:
        with conn:
            with conn.cursor() as cursor:
                for command in commands:
                    cursor.execute(command)
        print("Tables created successfully")
    except Exception as e:
        print(f"Error creating tables: {e}")
    finally:
        conn.close()

def insert_initial_data():
    """Insert initial data into the database"""
    conn = psycopg2.connect(
        os.environ.get("DATABASE_URL")
    )
    
    try:
        with conn:
            with conn.cursor() as cursor:
                # Check if we already have story prompts
                cursor.execute("SELECT COUNT(*) FROM story_prompts")
                count = cursor.fetchone()[0]
                
                if count == 0:
                    # Insert initial story prompts
                    cursor.execute(
                        """
                        INSERT INTO story_prompts 
                        (character_type, setting_type, theme_type, age_group, language) 
                        VALUES
                        ('Princess', 'Castle', 'Adventure', '3-5', 'en'),
                        ('Pirate', 'Ship', 'Treasure Hunt', '6-8', 'en'),
                        ('Astronaut', 'Space', 'Discovery', '9-12', 'en'),
                        ('Wizard', 'Magic School', 'Learning', '3-5', 'en'),
                        ('Dragon', 'Mountain', 'Friendship', '6-8', 'en'),
                        ('Robot', 'Future City', 'Technology', '9-12', 'en'),
                        ('Prinsessa', 'Slott', 'Äventyr', '3-5', 'sv'),
                        ('Pirat', 'Skepp', 'Skattjakt', '6-8', 'sv'),
                        ('Astronaut', 'Rymden', 'Upptäckt', '9-12', 'sv'),
                        ('Trollkarl', 'Magiskola', 'Lärande', '3-5', 'sv'),
                        ('Drake', 'Berg', 'Vänskap', '6-8', 'sv'),
                        ('Robot', 'Framtidsstad', 'Teknologi', '9-12', 'sv')
                        """
                    )
                    print("Initial story prompts inserted")
    except Exception as e:
        print(f"Error inserting initial data: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    # Wait a moment for the database to be ready
    time.sleep(5)
    create_tables()
    insert_initial_data()
