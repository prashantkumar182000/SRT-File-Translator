from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import anthropic
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize Anthropic client
# Make sure to set your API key as an environment variable
client = anthropic.Anthropic(
    api_key=''
)


class TranslationRequest(BaseModel):
    text: str
    target_language: str


@app.post("/translate")
async def translate_text(request: TranslationRequest):
    try:
        # Create the prompt for translation
        prompt = f"Translate the following text to {request.target_language}: {request.text}"

        # Call Claude API
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extract the translated text from the response
        translated_text = message.content[0].text

        return {"translated_text": translated_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)