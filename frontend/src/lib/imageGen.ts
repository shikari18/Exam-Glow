/**
 * imageGen.ts — Shared diagram/image generation utility
 *
 * Priority 1: Gemini Imagen 3 (high-quality labeled educational diagrams)
 * Priority 2: Pollinations Flux (free generative fallback)
 */

const GEMINI_KEY =
  (import.meta as any).env?.VITE_GEMINI_VOICE_API_KEY || "";

/**
 * Generates an educational diagram image for a given description.
 * Returns a data URI (Imagen 3) or a URL (Pollinations fallback).
 */
export async function generateDiagramImage(prompt: string): Promise<string> {
  const educationalPrompt =
    `IGCSE textbook educational diagram: ${prompt}. ` +
    `Clean white background, clearly labeled with arrows and text, ` +
    `scientific illustration style, detailed and accurate, high quality.`;

  // ── Tier 1: Gemini Imagen 3 ─────────────────────────────────────────────────
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: educationalPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "4:3",
            safetyFilterLevel: "BLOCK_ONLY_HIGH",
            personGeneration: "DONT_ALLOW",
          },
        }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const b64 = data.predictions?.[0]?.bytesBase64Encoded;
      const mime = data.predictions?.[0]?.mimeType || "image/png";
      if (b64) {
        console.log("[imageGen] ✅ Imagen 3 success");
        return `data:${mime};base64,${b64}`;
      }
    } else {
      const errText = await res.text();
      console.warn("[imageGen] Imagen 3 non-OK:", res.status, errText.slice(0, 200));
    }
  } catch (e) {
    console.warn("[imageGen] Imagen 3 exception:", e);
  }

  // ── Tier 2: Pollinations Flux (no auth required) ────────────────────────────
  console.log("[imageGen] Falling back to Pollinations...");
  const seed = Math.floor(Math.random() * 99999);
  const encoded = encodeURIComponent(educationalPrompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&nologo=true&model=flux&seed=${seed}`;
}
