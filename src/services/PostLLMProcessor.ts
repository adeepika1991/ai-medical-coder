// src/modules/services/PostLLMProcessor.ts
import { LLMOutput, LLMCodeSuggestion } from '@/types/types';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class PostLLMProcessor {
  private maxRetries = 2;

  async process(
    output: LLMOutput | null,
    revisionId: string,
    generatePromptType: string
  ): Promise<{ suggestions: LLMCodeSuggestion[]; success: boolean }> {
    // --- Metadata merge ---
    try {
      const existing = await prisma.soapNoteRevision.findUnique({
        where: { id: revisionId },
        select: { metadata: true },
      });

      // Ensure metadata is a Prisma.JsonObject, fallback to empty object
      const prevMeta: Prisma.JsonObject =
        existing?.metadata && typeof existing.metadata === 'object'
          ? (existing.metadata as Prisma.JsonObject)
          : {};

      // Merge new promptType
      const mergedMetadata: Prisma.JsonObject = {
        ...prevMeta,
        promptType: generatePromptType,
      };

      // Update revision
      await prisma.soapNoteRevision.update({
        where: { id: revisionId },
        data: { metadata: mergedMetadata },
      });
    } catch (error) {
      console.warn('Failed to log promptType in metadata', error);
    }
    // --- Validate LLM output ---
    if (!output || !output.suggestions) {
      if (this.maxRetries > 0) {
        console.warn('No valid output. Retrying...');
        return this.retryWithFallback(revisionId, generatePromptType);
      }
      return { suggestions: [], success: false };
    }

    const validSuggestions: LLMCodeSuggestion[] = [];
    const seen = new Set<string>();

    for (const s of output.suggestions) {
      const key = `${s.codeType}:${s.code}`;
      if (seen.has(key)) continue;
      seen.add(key);

      if (this.isValidCode(s.code, s.codeType)) {
        validSuggestions.push(s);
      }
    }

    // --- Persist suggestions ---
    if (validSuggestions.length > 0) {
      try {
        await prisma.suggestedCode.createMany({
          data: validSuggestions.map((s) => ({
            revisionId,
            code: s.code,
            codeType: s.codeType,
            confidence: s.confidence,
          })),
          skipDuplicates: true, // avoid duplicate insert errors
        });
      } catch (error) {
        console.error('Failed to save suggested codes', error);
      }
    }

    return { suggestions: validSuggestions, success: true };
  }

  private async retryWithFallback(
    revisionId: string,
    promptType: string
  ): Promise<{ suggestions: LLMCodeSuggestion[]; success: boolean }> {
    console.log('Using fallback logic after failed LLM response');
    return { suggestions: [], success: false };
  }

  async quarantine(rawResponse: string, revisionId: string, error: string): Promise<void> {
    console.warn('[LLM Quarantine]', { rawResponse, revisionId, error });
  }

  private isValidCode(code: string, type: string): boolean {
    switch (type) {
      case 'ICD':
        return /^[A-Z0-9]{3,7}$/.test(code);
      case 'CPT':
        return /^\d{5}$/.test(code); // ✅ No double backslash
      case 'HCPCS':
        return /^[A-Z]\d{4}$|^\d{5}$/.test(code); // ✅ Clean
      default:
        return false;
    }
  }
}
