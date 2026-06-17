import json

content = open('ai_assistant/views.py', 'r', encoding='utf-8').read()

old_marker = '\nclass GenerateTopicNotesView(APIView):'
new_marker = '\nclass AgentView(APIView):'

start_idx = content.find(old_marker)
end_idx = content.find(new_marker, start_idx)

print(f'start_idx={start_idx}, end_idx={end_idx}')

new_class = r'''
class GenerateTopicNotesView(APIView):
    """
    Generate structured revision notes for any topic and subject dynamically.
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [AIRateThrottle]

    def post(self, request):
        topic = request.data.get('topic', '').strip()
        subject = request.data.get('subject', '').strip()
        if not topic:
            return Response({'error': 'Topic is required.'}, status=status.HTTP_400_BAD_REQUEST)

        ai = AIService()

        def _repair_json(text: str):
            """Robust JSON extraction: strip fences, try full parse, then find outermost {}."""
            cleaned = (text or '').strip()
            for prefix in ('```json', '```'):
                if cleaned.startswith(prefix):
                    cleaned = cleaned[len(prefix):]
                    break
            if cleaned.endswith('```'):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            # Attempt 1: direct parse
            try:
                return json.loads(cleaned)
            except Exception:
                pass
            # Attempt 2: outermost {...} block
            start = cleaned.find('{')
            end = cleaned.rfind('}')
            if start != -1 and end != -1 and end > start:
                try:
                    return json.loads(cleaned[start:end + 1])
                except Exception:
                    pass
            # Attempt 3: trim after last complete page
            snippet = cleaned[start:] if start != -1 else cleaned
            for trail in ('}\n  ]\n}', '}\n]\n}', '}]}', '}\n]'):
                idx = snippet.rfind(trail)
                if idx != -1:
                    candidate = snippet[:idx + len(trail)]
                    if not candidate.endswith('}'):
                        candidate += '}'
                    try:
                        return json.loads(candidate)
                    except Exception:
                        pass
            raise ValueError('Could not parse valid JSON from AI response')

        PROMPT_TEMPLATE = (
            "You are an expert IGCSE curriculum editor. Generate a comprehensive study guide for "
            "the topic '{topic}' in '{subject}'.\n\n"
            "STRICT REQUIREMENTS:\n"
            "- Generate exactly 6 section pages\n"
            "- Each section has 4-6 blocks\n"
            "- Use **bold** for key terms inside text fields\n"
            "- Write equations/formulas as plain text WITHOUT dollar signs (write 'F = ma' not LaTeX)\n"
            "- Include 1 image block per section with an educational diagram prompt\n"
            "- CRITICAL: Return ONLY valid JSON. No markdown fences, no backticks, no extra text.\n\n"
            "Return EXACTLY this JSON shape (with 6 real pages):\n"
            "{{\n"
            '  "subject": "{subject}",\n'
            '  "title": "Study Guide: {topic}",\n'
            '  "summary": "4-sentence overview of the topic",\n'
            '  "pages": [\n'
            "    {{\n"
            '      "section": "Section Title",\n'
            '      "blocks": [\n'
            '        {{ "kind": "intro", "text": "Paragraph. Use **bold** for key terms." }},\n'
            '        {{ "kind": "bullets", "items": [ {{ "text": "Point", "bold": false, "sub": [] }} ] }},\n'
            '        {{ "kind": "definition", "term": "Term", "definition": "Definition text" }},\n'
            '        {{ "kind": "table", "headers": ["A", "B"], "rows": [["r1a","r1b"]] }},\n'
            '        {{ "kind": "tip", "text": "Exam tip text" }},\n'
            '        {{ "kind": "image", "prompt": "Detailed educational diagram of [concept], textbook style, labeled, white background", "caption": "Figure caption", "side": "full" }}\n'
            "      ]\n"
            "    }}\n"
            "  ]\n"
            "}}\n\n"
            "Generate 6 pages covering all key aspects of '{topic}'. ALL JSON must be complete and valid."
        )

        prompt = PROMPT_TEMPLATE.format(topic=topic, subject=subject or topic)

        try:
            response_text = async_to_sync(ai.chat)(
                [{'role': 'user', 'content': prompt}],
                max_tokens=12000,
                timeout=90,
            )

            if isinstance(response_text, str) and (
                'No AI provider API keys configured' in response_text
                or 'API Key missing' in response_text
            ):
                return Response(
                    {'error': 'AI is not configured. Set at least one provider key (GROQ_API_KEY, GOOGLE_STUDIO_API_KEY, or OPENROUTER_API_KEY).'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            note_data = _repair_json(response_text)

            # Ensure every section page has at least one image block
            for page in note_data.get('pages', []):
                blocks = page.get('blocks', []) or []
                has_image = any(b.get('kind') == 'image' for b in blocks)
                if not has_image:
                    section_title = page.get('section') or 'Diagram'
                    page.setdefault('blocks', []).append({
                        'kind': 'image',
                        'prompt': (
                            f"IGCSE textbook educational diagram for '{topic}' about '{section_title}'. "
                            f"Clean white background, labeled arrows, textbook style."
                        ),
                        'caption': f'Diagram: {section_title}',
                        'side': 'full',
                    })

            # Resolve image blocks
            from .image_service import generate_ai_image
            for page in note_data.get('pages', []):
                for block in page.get('blocks', []):
                    if block.get('kind') == 'image' and block.get('prompt') and not block.get('src'):
                        img_prompt = block['prompt']
                        logger.info(f'[NoteGen] Generating image for: {img_prompt[:80]}')
                        base64_img = generate_ai_image(img_prompt)
                        if base64_img:
                            block['src'] = base64_img
                        else:
                            import urllib.parse
                            import random
                            encoded_prompt = urllib.parse.quote(img_prompt)
                            block['src'] = f'https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=500&nologo=true&seed={random.randint(1, 99999)}'

            return Response(note_data)

        except ValueError:
            logger.exception('JSON repair failed for AI notes')
            return Response(
                {'error': 'Failed to generate notes: AI returned malformed content. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.exception('Failed to generate AI notes')
            return Response({'error': f'Failed to generate notes: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


'''

new_content = content[:start_idx] + new_class + content[end_idx:]
open('ai_assistant/views.py', 'w', encoding='utf-8').write(new_content)
print('SUCCESS - file rewritten')
print('New length:', len(new_content))
