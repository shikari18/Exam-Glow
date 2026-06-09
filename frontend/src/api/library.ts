/**
 * library.ts
 * Resource library API calls → Django /api/library/ endpoints.
 * Handles uploading materials, fetching AI-generated study kits,
 * and curated content.
 */
import { api, apiFetch, API_BASE, getAccessToken } from '@/lib/api-client';

export type ResourceStatus = 'processing' | 'ready' | 'error';
export type ResourceType = 'pdf' | 'video' | 'code' | 'slides' | 'other';

export type Resource = {
  id: number;
  title: string;
  resource_type: ResourceType;
  file_url: string | null;
  url: string;
  subject: string;
  cover_image_url: string | null;
  thumbnail_url: string;
  status: ResourceStatus;
  processing_progress: number;
  status_text: string;
  file_size: number;
  ai_summary: string;
  ai_concepts: unknown[];
  ai_notes_json: Record<string, unknown>;
  has_study_kit: boolean;
  extracted_images: { id: number; image: string; page_number: number; description: string }[];
  owner_name: string;
  author_name: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type AIFlashcard = {
  id?: number;
  question: string;
  answer: string;
  difficulty?: string;
  subject?: string;
};

export type AIQuiz = {
  id: number;
  title: string;
  format: string;
  questions: Array<{
    question: string;
    options?: Record<string, string>;
    correct_answer: string;
    explanation?: string;
  }>;
  academic_level: string;
  created_at: string;
};

/** Upload a new resource (PDF, DOCX, PPTX, YouTube URL, etc.) */
export async function uploadResource(data: {
  title: string;
  resource_type: ResourceType;
  file?: File;
  url?: string;
  subject?: string;
  selected_features?: string[];
}): Promise<Resource> {
  const form = new FormData();
  form.append('title', data.title);
  form.append('resource_type', data.resource_type);
  if (data.file) form.append('file', data.file);
  if (data.url) form.append('url', data.url);
  if (data.subject) form.append('subject', data.subject);
  if (data.selected_features) form.append('selected_features', JSON.stringify(data.selected_features));

  const token = getAccessToken();
  const res = await fetch(`${API_BASE}/api/library/resources/`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (!res.ok) {
    let detail: unknown;
    try { detail = await res.json(); } catch { detail = await res.text(); }
    const message = typeof detail === 'object' && detail !== null
      ? (detail as any).error ?? (detail as any).detail ?? `Upload failed (${res.status})`
      : String(detail) || `Upload failed (${res.status})`;
    throw { status: res.status, message, detail };
  }
  return res.json();
}

/** Get all resources owned by the current user */
export async function getMyResources(type?: ResourceType): Promise<Resource[]> {
  const qs = type ? `?type=${type}` : '';
  return api.get<Resource[]>(`/api/library/resources/${qs}`);
}

/** Get a single resource */
export async function getResource(id: number): Promise<Resource> {
  return api.get<Resource>(`/api/library/resources/${id}/`);
}

/** Delete a resource */
export async function deleteResource(id: number): Promise<void> {
  return api.delete(`/api/library/resources/${id}/`);
}

/** Get curated/public resources */
export async function getCuratedResources(type?: ResourceType): Promise<Resource[]> {
  const qs = type ? `?type=${type}` : '';
  return api.get<Resource[]>(`/api/library/resources/curated/${qs}`);
}

/** Generate flashcards from a resource */
export async function generateFlashcards(
  resourceId: number,
  count = 10,
  level = 'igcse',
): Promise<{ preview_cards: AIFlashcard[] }> {
  return api.post(`/api/library/resources/${resourceId}/flashcards/generate/`, { count, level });
}

/** Generate a quiz from a resource */
export async function generateQuiz(
  resourceId: number,
  format: 'mcq' | 'short' | 'mixed' = 'mcq',
  count = 10,
  level = 'igcse',
): Promise<AIQuiz> {
  return api.post(`/api/library/resources/${resourceId}/quiz/generate/`, { format, count, level });
}

/** Generate practice questions from a resource */
export async function generatePracticeQuestions(
  resourceId: number,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count = 5,
): Promise<unknown[]> {
  return api.post(`/api/library/resources/${resourceId}/practice/generate/`, { difficulty, count });
}

/** Generate a mind map from a resource */
export async function generateMindMap(resourceId: number): Promise<unknown> {
  return api.post(`/api/library/resources/${resourceId}/mindmap/generate/`, {});
}

/** Save AI flashcards to a user deck */
export async function saveFlashcardsToDeck(
  deckId: number,
  resourceId: number,
  flashcards: AIFlashcard[],
): Promise<AIFlashcard[]> {
  return api.post(`/api/library/decks/${deckId}/save-flashcards/`, {
    resource_id: resourceId,
    flashcards,
  });
}

/** List user's personal flashcard decks */
export async function getMyDecks(): Promise<Array<{ id: number; title: string; subject: string; total_cards: number; due_count: number }>> {
  return api.get('/api/library/decks/');
}

/** Create a new personal deck */
export async function createDeck(title: string, subject: string): Promise<{ id: number; title: string; subject: string }> {
  return api.post('/api/library/decks/', { title, subject });
}

/** Reprocess / force re-synthesise a resource */
export async function reprocessResource(resourceId: number): Promise<{ success: boolean }> {
  return api.post(`/api/library/resources/${resourceId}/reprocess/`, {});
}
