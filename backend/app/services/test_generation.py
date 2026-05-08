import json
from typing import List, Dict, Any
from openai import OpenAI
from app.models.test import QuestionType

def get_openai_client():
    return OpenAI()

def generate_assessment_from_material(
    study_material: str, 
    topic: str, 
    difficulty: str, 
    types: List[QuestionType], 
    count: int
) -> List[Dict[str, Any]]:
    """
    Calls OpenAI to generate assessment questions based on the provided study material.
    """
    try:
        client = get_openai_client()
        
        # Prepare the type string for the prompt
        type_strings = [t.value for t in types]
        types_str = ", ".join(type_strings)
        
        system_prompt = f"""
        You are an expert AI exam creator. 
        Based on the provided study material, generate {count} questions about the topic "{topic}".
        The difficulty level should be "{difficulty}".
        The types of questions must be randomly selected from: [{types_str}].
        
        Output strictly in JSON format as a list of objects.
        Each object must have:
        - "question_type": One of {type_strings}
        - "content": The question text or flashcard front
        - "options": An array of 4 string options (ONLY if question_type is MCQ, otherwise null)
        - "correct_answer": The exact string of the correct option (for MCQ), or the flashcard back/subjective answer.
        """
        
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate JSON for the following material:\n\n{study_material}\n\nFormat the output as {{\"questions\": [...]}}"}
            ]
        )
        
        result_content = response.choices[0].message.content
        parsed = json.loads(result_content)
        return parsed.get("questions", [])
        
    except Exception as e:
        print(f"Error generating assessment: {e}")
        return []
