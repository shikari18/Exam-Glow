import type { NoteChapter } from "./types";

export const englishReadingNotes: NoteChapter = {
  subject: "English Language",
  title: "Reading Skills",
  pages: [
    {
      section: "1.1 Reading for Information and Retrieval",
      blocks: [
        { kind: "video", youtubeId: "MSYw502dJNY", title: "Reading Comprehension Skills — IGCSE English Language", caption: "How to read texts carefully, retrieve information, make inferences, and identify writer's purpose and attitude" },
        { kind: "intro", text: "**Reading comprehension** tests your ability to understand, retrieve, and interpret information from unseen texts. Cambridge IGCSE English features both fiction and non-fiction texts." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/400px-Camponotus_flavomarginatus_ant.jpg", caption: "Effective reading is active, not passive: annotate the text, underline key information, and question the writer's choices and purpose as you read — don't just absorb words passively.", side: "right" },
        { kind: "keyterms", terms: [
          { label: "Retrieval", value: "Finding and selecting specific information stated explicitly in the text. The answer is 'there' — you just need to locate it." },
          { label: "Inference", value: "Reading between the lines — working out what is implied but NOT directly stated. Always support with evidence from the text." },
          { label: "Connotation", value: "The emotional or cultural associations of a word beyond its literal meaning. 'Slim' (positive) vs 'skinny' (negative) vs 'thin' (neutral)." },
          { label: "Tone", value: "The attitude or mood conveyed by the writer — formal, informal, humorous, sarcastic, serious, optimistic, melancholic, anxious." },
          { label: "Register", value: "The level of formality used — formal (academic writing, official letters) vs informal (casual conversation, personal blogs)." },
          { label: "Audience", value: "Who the text is written FOR. Evidence: vocabulary level, references used, tone, assumed knowledge." },
          { label: "Purpose", value: "WHY the text was written — to inform, persuade, entertain, advise, argue, describe, explain, instruct." },
        ]},
        { kind: "highlight", text: "**Reading question strategy (5 steps):**\n1. Read the question carefully — note marks available and which paragraph(s) to search\n2. Read the relevant section of the text — underline key evidence\n3. Find the precise evidence that answers the question\n4. Express it in YOUR OWN WORDS (unless asked to quote)\n5. Check: have you answered the EXACT question asked?\n\n**2-mark answer:** State the point + develop/explain\n**4-mark answer:** Point + quote + explain effect × 2", color: "blue" },
        { kind: "tip", text: "Never copy long chunks of text as your answer — USE YOUR OWN WORDS for retrieval. Find the relevant part, identify the key idea, rephrase it clearly. Copying earns 0 marks." },
        { kind: "warning", text: "Most common mistake: answering a different question than the one asked. Read the question TWICE before finding your answer. Circle the key instruction word (explain, describe, suggest, how, why) — it tells you exactly what the examiner wants." },
      ],
    },
    {
      section: "1.2 Language Analysis and Effects",
      blocks: [
        { kind: "video", youtubeId: "l_U5RiYPlkQ", title: "Language Techniques and Effects — IGCSE English Language", caption: "Simile, metaphor, personification, alliteration, onomatopoeia, hyperbole and more — identifying techniques and analysing their effects on the reader" },
        { kind: "intro", text: "Language analysis questions ask HOW writers use language to create effects. You must identify techniques, quote from the text, and explain the precise EFFECT on the reader — not just label the technique." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Writing-utensils.jpg/600px-Writing-utensils.jpg", caption: "Writers carefully select every word, technique and structure to create specific effects on the reader. Your job in language analysis is to reverse-engineer those choices — explaining WHY each technique was chosen and WHAT effect it achieves.", side: "right" },
        { kind: "table", headers: ["Technique", "Definition", "Effect on reader"], rows: [
          ["Simile", "Comparison using 'like' or 'as' (e.g. 'her voice was like honey')", "Creates vivid imagery; helps reader visualise through familiar comparison"],
          ["Metaphor", "Stating one thing IS another (e.g. 'the classroom was a prison')", "More powerful than simile; forces reader to see something in a completely new way"],
          ["Personification", "Giving human qualities to non-human things (e.g. 'the wind screamed')", "Makes abstract/natural things relatable; creates drama or atmosphere"],
          ["Alliteration", "Repetition of consonant sounds at start of words ('cold, cruel, calculated')", "Creates rhythm; draws attention to key words; can mirror the sound being described"],
          ["Sibilance", "Repetition of 's' sounds ('slithered slowly and silently')", "Creates hissing, sinister, or soothing sound effect"],
          ["Onomatopoeia", "Words that sound like what they describe ('crash', 'whisper', 'buzz')", "Makes writing vivid and immersive — draws reader into the scene"],
          ["Repetition", "Deliberate repeating of a word/phrase ('Never, never, never give up')", "Emphasises the idea; creates rhythm; builds emotional intensity"],
          ["Hyperbole", "Extreme exaggeration ('I've told you a million times!')", "Emphasises an emotion or idea; can be humorous or dramatic"],
          ["Rhetorical question", "Question not expecting an answer ('Is this really what we want?')", "Engages the reader; challenges them to think; creates feeling of involvement"],
          ["Rule of three", "Three related items listed together ('fast, furious, and fearless')", "Creates satisfying rhythm; emphasises through accumulation; feels complete and persuasive"],
          ["Juxtaposition", "Placing contrasting ideas side by side ('the silence was deafening')", "Creates tension, highlights contrast, makes both ideas more powerful"],
          ["Imagery", "Language that creates a vivid picture in the reader's mind", "Makes writing more concrete and memorable; creates atmosphere"] ,
        ]},
        { kind: "highlight", text: "**P-E-E response structure (Point-Evidence-Explain):**\n\n**Point:** The writer creates a sense of danger...\n**Evidence:** ...through the use of a metaphor: 'the sea was a hungry beast'\n**Explain:** The word 'hungry' suggests the sea is actively seeking to devour things, creating a threatening, predatory image that makes the reader feel the characters are in genuine peril — the sea is presented as an unstoppable predator, not just a natural force.\n\n→ Don't say WHAT the technique is — say WHAT EFFECT it has and WHY the writer chose it.", color: "pink" },
        { kind: "tip", text: "Avoid vague comments like 'this makes the reader feel emotional.' Be PRECISE: what specific emotion? Use phrases like: 'creates a sense of...', 'suggests that...', 'implies...', 'evokes a feeling of...', 'makes the reader picture...'." },
      ],
    },
  ],
};

export const englishWritingNotes: NoteChapter = {
  subject: "English Language",
  title: "Writing Skills",
  pages: [
    {
      section: "2.1 Writing Techniques and Structure",
      blocks: [
        { kind: "video", youtubeId: "z_bLrIJC6a0", title: "Writing for Purpose and Audience — IGCSE English Language", caption: "How to write for different purposes (persuade, inform, describe, narrate) and audiences — form, register and language choices" },
        { kind: "intro", text: "IGCSE English writing tasks assess your ability to write for a specific **purpose**, **audience**, and **form** using controlled, sophisticated language. Quality over quantity — every sentence should be deliberately crafted." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg", caption: "Descriptive writing: zoom in on specific, sensory details — the waxy shine of an apple, the faint sweetness in the air. Precise, concrete language is always more powerful than vague, general description.", side: "right" },
        { kind: "keyterms", terms: [
          { label: "Purpose", value: "WHY you are writing — to persuade, argue, inform, explain, advise, entertain, describe, narrate." },
          { label: "Audience", value: "WHO you are writing for — affects vocabulary, tone, formality, and assumed knowledge." },
          { label: "Form", value: "The type of text — letter, article, speech, report, diary, review, blog, leaflet." },
          { label: "Register", value: "Level of formality. Formal for official letters; informal for personal blogs, friendly letters." },
          { label: "Cohesion", value: "Use of linguistic devices (pronouns, synonyms, connectives) to create smooth flow within and between paragraphs." },
        ]},
        { kind: "highlight", text: "**DAFOREST — persuasive writing techniques:**\n**D**irect address ('You need to act now...')\n**A**necdote (short personal story to engage reader)\n**F**acts and figures ('Studies show 90% of...')\n**O**pinion stated as fact ('It is clear that...')\n**R**hetorical question ('How much longer can we ignore this?')\n**E**xpert opinion ('According to leading scientists...')\n**S**tatistic ('Every 2 minutes, another species goes extinct')\n**T**riple/Rule of three ('fast, furious, and frightening')", color: "blue" },
        { kind: "comparison", left: { label: "Narrative writing", items: ["Story-driven — characters, plot, setting, conflict", "First or third person consistently throughout", "Chronological or non-linear structure", "Create tension through pacing and conflict", "Show, don't tell — reveal character through action/dialogue", "Strong opening hook + satisfying resolution"] }, right: { label: "Descriptive writing", items: ["Focused on sensory experience — NO plot required", "Describe a scene, moment, or person in vivid detail", "Engage all five senses (sight, sound, smell, touch, taste)", "Vary sentence lengths for rhythm and effect", "Use figurative language throughout every paragraph", "Create atmosphere through word choice — connotations matter"] } },
      ],
    },
    {
      section: "2.2 Directed Writing and Summary",
      blocks: [
        { kind: "video", youtubeId: "C_qJU9jVsrk", title: "Directed Writing and Summary — IGCSE English Language", caption: "How to approach directed writing tasks (letters, articles, speeches, reports) and how to write effective summaries in own words" },
        { kind: "intro", text: "**Directed writing** asks you to produce a specific text type in response to a source text. **Summary** tasks require condensing key information into a set number of words in your own words." },
        { kind: "bullets", items: [
          { text: "**Directed writing approach (5 steps):**", sub: [
            "1. Read the question: identify FORM (letter? speech? report?), AUDIENCE, and PURPOSE",
            "2. Identify relevant information in the source text to include",
            "3. TRANSFORM the information — adapt it for your new purpose and audience",
            "4. Match tone and register to audience (formal letter → Dear Mr/Ms; informal blog → chatty, personal)",
            "5. Include appropriate form conventions (letter: address, date, greeting, sign-off; article: headline, subheadings; speech: direct address, rhetorical devices)",
          ]},
          { text: "**Summary writing approach (5 steps):**", sub: [
            "1. Read the passage carefully — identify ONLY information asked for in the question",
            "2. Underline/highlight the relevant points — aim for number of points matching marks available",
            "3. Write each point in YOUR OWN WORDS — do not copy sentences from the text",
            "4. Use connectives to create flowing, linked prose (not a bullet list)",
            "5. Count words and ensure you are within the word limit",
          ]},
        ]},
        { kind: "highlight", text: "**Summary tips:**\n• Each point worth 1 mark — make each distinct and clear\n• Use OWN WORDS throughout — copying = 0 marks\n• Write in continuous prose paragraphs, NOT bullet points\n• Do NOT add personal opinion or information from outside the text\n• Open with: 'The passage suggests...' or 'According to the text...'", color: "green" },
        { kind: "tip", text: "Directed writing is marked on TWO criteria: (1) reading — how well you use the source material; (2) writing — quality of language, style, and appropriateness for purpose and audience. Don't neglect either!" },
      ],
    },
    {
      section: "2.3 Creative Writing — Narrative and Descriptive",
      blocks: [
        { kind: "video", youtubeId: "pIzfAN2VJBA", title: "Creative Writing Tips — IGCSE English Language", caption: "How to write outstanding narrative and descriptive pieces — structure, language choices, openings, sentence variety and memorable endings" },
        { kind: "intro", text: "Creative writing rewards students who take risks, use ambitious vocabulary, and craft writing with genuine personality, control and flair. Examiners want to see CRAFT — not just a story retold." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Books_on_a_shelf.jpg/800px-Books_on_a_shelf.jpg", caption: "Great writers understand that every word choice matters. In creative writing exams, selecting one perfectly precise, vivid word over two ordinary ones shows craft and earns higher marks.", side: "right" },
        { kind: "bullets", items: [
          { text: "**Narrative writing checklist:**", sub: [
            "✓ Strong opening hook — begin with action, dialogue, or in medias res (in the middle of the action)",
            "✓ Vivid characters — show personality through actions, dialogue, and behaviour; NOT description alone",
            "✓ Structured plot — clear rising tension, climax, resolution (or deliberate open ending)",
            "✓ Varied sentence structures — short sentences for tension; longer for description and reflection",
            "✓ Plan before writing — even 3 minutes; leave 5 minutes to check at the end",
            "✓ Satisfying ending — circular, surprising, ambiguous, or emotionally resonant",
          ]},
          { text: "**Descriptive writing checklist:**", sub: [
            "✓ Establish a clear focus — a specific scene, person, moment, memory, or atmosphere",
            "✓ All 5 senses — what can you see, hear, smell, touch, taste?",
            "✓ Variety of figurative language — similes, metaphors, personification, sibilance, etc.",
            "✓ Zoom in on specific details — the cracks in the pavement, the smell of rain on hot tarmac",
            "✓ Create atmosphere through word choice — select words with appropriate connotations",
            "✓ Vary paragraph length — one-sentence paragraphs create dramatic impact",
          ]},
        ]},
        { kind: "highlight", text: "**Sentence variety for effect:**\n• Short. Sharp. Powerful. (creates urgency, tension, impact)\n• Long, flowing sentences that stretch through the description, pulling the reader deeper into the scene and refusing to let go until the full picture is painted in their mind. (creates atmosphere)\n• The question (creates engagement): What was that sound?\n• Minor fragment. Like a whisper. (creates drama, mirrors fractured thought)", color: "pink" },
        { kind: "tip", text: "ALWAYS plan before you write — even 3 minutes of planning produces better writing than diving in. Consider: opening hook, 2–3 key moments/images, language techniques to use deliberately, and a memorable ending. Planning separates good writers from great ones." },
        { kind: "warning", text: "Most common mistake: writing too much PLOT (what happened) and not enough CRAFT (HOW you write it). Examiners reward quality over quantity. A beautifully crafted 400-word response earns more marks than 800 words of rushed, generic narrative." },
      ],
    },
  ],
};
