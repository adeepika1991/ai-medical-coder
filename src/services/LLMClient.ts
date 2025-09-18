import { z } from 'zod';
import { LLMOutput, ResolvedPrompt } from '@/types/types';

// ------------------ Zod Schema for LLM Output ------------------
const LLMOutputSchema: z.ZodSchema<LLMOutput> = z.object({
  suggestions: z.array(
    z.object({
      code: z.string().min(1, 'Code cannot be empty'),
      codeType: z.enum(['ICD', 'CPT', 'HCPCS'], { message: 'Invalid code type' }),
      confidence: z.number().min(0).max(1),
      reasoning: z.string().optional(),
    })
  ),
});

// ------------------ LLM Client ------------------
export class LLMClient {
  private apiKey: string;
  private model: string;

  constructor(
    apiKey: string = process.env.OPENROUTER_API_KEY!,
    model: string = 'mistralai/mistral-7b-instruct'
  ) {
    if (!apiKey) throw new Error('OPENROUTER_API_KEY is required');
    this.apiKey = apiKey;
    this.model = model;
  }

  /**
   * Calls the LLM with a structured system/user prompt
   * Expects strict JSON response with `suggestions[]`
   */
  async generate(inputPrompt: ResolvedPrompt['prompt']): Promise<LLMOutput> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000); // 30s timeout

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Medical Coding Assistant',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system' as const, content: inputPrompt.system },
            {
              role: 'user' as const,
              content:
                typeof inputPrompt.user === 'string'
                  ? inputPrompt.user
                  : JSON.stringify(inputPrompt.user, null, 2),
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`LLM HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const rawContent = data.choices?.[0]?.message?.content?.trim();

      if (!rawContent) {
        throw new Error('Empty response from LLM');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawContent);
      } catch (e) {
        throw Object.assign(new Error('LLM returned invalid JSON'), { rawResponse: rawContent });
      }

      const result = LLMOutputSchema.safeParse(parsed);
      if (!result.success) {
        console.error('LLM Output Validation Error:', result.error);
        throw Object.assign(new Error(`LLM response validation failed: ${result.error.message}`), {
          rawResponse: rawContent,
        });
      }

      return result.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === 'AbortError') {
        error.message = 'LLM request timed out';
      }
      // Attach raw response if not already present
      if (typeof error.rawResponse === 'undefined') {
        error.rawResponse = error.rawResponse || 'n/a';
      }
      throw error;
    }
  }
}
