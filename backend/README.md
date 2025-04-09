# StoryTeller AI Backend

This is the backend for the StoryTeller AI application, built with FastAPI, PostgreSQL, and OpenAI integration.

## Prerequisites

- Docker and Docker Compose
- OpenAI API key

## Getting Started

1. Clone the repository
2. Navigate to the backend directory:

```bash
cd story-teller-ai/backend
```

3. Create a `.env` file with your OpenAI API key:

```bash
# .env
DATABASE_URL=postgresql://storyteller:storyteller123@db:5432/storyteller
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the services:

```bash
docker-compose up
```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Database Structure

The database contains the following tables:

- `users` - User accounts
- `stories` - Generated stories
- `story_prompts` - Templates for story generation
- `saved_stories` - Stories saved by users

### Key Features

- Story generation using OpenAI's GPT model
- Support for multiple languages (English and Swedish)
- Age-appropriate content generation
- Story saving and retrieval 