import json
from openai import OpenAI

def get_openai_client():
    return OpenAI()

def generate_study_material(text: str) -> dict:
    """
    Sends the transcribed/extracted text to the LLM to generate structured study material:
    Summary, Key Points, and Revision Notes.
    """
    try:
        client = get_openai_client()
        
        system_prompt = """
        You are an expert AI tutor. Your task is to process raw study material (transcripts or OCR text)
        and output a structured JSON response containing:
        1. "summary": A concise summary of the material.
        2. "key_points": An array of important bullet points.
        3. "revision_notes": Important definitions, formulas, or concepts to remember.
        
        Ensure your response is valid JSON format.
        """
        
        response = client.chat.completions.create(
            model="gpt-4o", # Can fallback to gpt-3.5-turbo or groq models for speed
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the raw text to process:\n\n{text}"}
            ]
        )
        
        result_content = response.choices[0].message.content
        return json.loads(result_content)
    except Exception as e:
        print(f"Error generating study material: {e}")
        return {"error": "Could not generate study material.", "detail": str(e)}
