"""
exam_prep.py
AI-powered exam paper generator for ExamGlow's open session mode.
Generates MCQ, written, or mixed questions for a given subject.
"""
import json
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from ai_assistant.services import AIService

logger = logging.getLogger('nitemind')

MCQ_SCHEMA = '''[
  {
    "question": "Question text",
    "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
    "correct_answer": "A",
    "explanation": "Why A is correct and the others are wrong",
    "topic": "Topic name",
    "marks": 1
  }
]'''

WRITTEN_SCHEMA = '''[
  {
    "question": "Question text",
    "marks": 4,
    "solution": "Full model answer with marking points clearly listed",
    "examTip": "One concise exam technique tip",
    "topic": "Topic name"
  }
]'''


def build_exam_prompt(subject: str, mode: str, count: int) -> str:
    half = count // 2
    rest = count - half

    if mode == "mcq":
        return f"""You are an IGCSE examiner for {subject}. Generate exactly {count} multiple-choice questions.

IMPORTANT: Return ONLY a valid JSON array — no markdown, no explanation, no preamble.

Schema for each question:
{MCQ_SCHEMA}

Requirements:
- Cover a variety of topics across the {subject} syllabus
- Use clear, unambiguous language appropriate for 14-16 year olds
- Each wrong option should be plausible (common misconceptions)
- Explanation should be 1-3 sentences maximum
- Vary difficulty: roughly 40% easy, 40% medium, 20% hard"""

    if mode == "written":
        return f"""You are an IGCSE examiner for {subject}. Generate exactly {count} written exam questions.

IMPORTANT: Return ONLY a valid JSON array — no markdown, no explanation, no preamble.

Schema for each question:
{WRITTEN_SCHEMA}

Requirements:
- Cover a variety of topics across the {subject} syllabus  
- Marks should vary: 2-mark, 4-mark, and 6-mark questions
- Solution must include all marking points the examiner would look for
- examTip should be practical advice specific to this question type"""

    # mixed
    return f"""You are an IGCSE examiner for {subject}. Generate a mixed exam paper: {half} MCQ questions then {rest} written questions.

IMPORTANT: Return ONLY a valid JSON array — no markdown, no explanation, no preamble.

MCQ schema:
{{"question":"...","options":{{"A":"...","B":"...","C":"...","D":"..."}},"correct_answer":"A","explanation":"...","topic":"...","marks":1}}

Written schema:
{{"question":"...","marks":4,"solution":"...","examTip":"...","topic":"..."}}

Requirements:
- Cover a variety of topics across the {subject} syllabus
- Mix of difficulty levels
- MCQ options should include plausible distractors"""


class ExamPrepView(APIView):
    """
    POST /api/ai/exam-prep/
    Body: { subject, mode: "mcq"|"written"|"mixed", count: int }
    Returns: { questions: [...] }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        subject = request.data.get('subject', 'Biology')
        mode = request.data.get('mode', 'mcq')
        count = min(int(request.data.get('count', 10)), 25)  # cap at 25

        if mode not in ('mcq', 'written', 'mixed'):
            return Response({'error': 'Invalid mode. Use mcq, written, or mixed.'}, status=400)

        prompt = build_exam_prompt(subject, mode, count)

        try:
            ai = AIService()
            # Use the raw completion method for structured JSON output
            raw = ai.raw_completion(
                prompt=prompt,
                system="You are an expert IGCSE examiner. Always return pure JSON arrays with no surrounding text.",
                max_tokens=4096,
                temperature=0.7,
            )

            # Extract JSON array from the response
            json_match = None
            import re
            matches = re.findall(r'\[[\s\S]*\]', raw)
            if matches:
                json_match = max(matches, key=len)

            if not json_match:
                logger.error(f"[ExamPrep] No JSON array found in AI response: {raw[:500]}")
                return Response({'error': 'AI returned an unexpected format. Please try again.'}, status=500)

            questions = json.loads(json_match)
            return Response({'questions': questions})

        except json.JSONDecodeError as e:
            logger.error(f"[ExamPrep] JSON parse error: {e}")
            return Response({'error': 'Failed to parse AI response. Please try again.'}, status=500)
        except Exception as e:
            logger.error(f"[ExamPrep] Error: {e}")
            return Response({'error': str(e)}, status=500)
