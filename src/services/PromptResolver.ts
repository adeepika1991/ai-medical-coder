import { PromptResolverInput, ResolvedPrompt, PromptStyle, BoostResult } from '@/types/types';

export class PromptResolver {
  resolve(input: PromptResolverInput): ResolvedPrompt {
    const { currentNote, matches, config } = input;
    const k = config?.topK ?? 5;
    const strong = config?.strongMatchThreshold ?? 0.9;

    // Filter low-quality matches
    const filtered = matches.filter((m) => m.boostScore > 0.3);
    const scenarioTags = [...new Set(filtered.flatMap((m) => m.scenarioTags))];

    let context: ResolvedPrompt['prompt']['user']['context'] = [];
    const warnings: string[] = [];

    // Determine prompt type and build context
    if (filtered.length === 0) {
      return {
        prompt: {
          system:
            'You are a medical coding assistant. Suggest ICD, CPT, or HCPCS codes with confidence scores. Respond in strict JSON.',
          user: {
            currentNote,
            warnings: ['No similar historical notes found.'],
          },
        },
        promptType: 'NO_MATCH',
        scenarioTags,
        rawMatches: matches,
      };
    }

    if (scenarioTags.includes('duplicate')) {
      return {
        prompt: {
          system: 'Avoid redundant coding. This note appears duplicated.',
          user: {
            currentNote,
            warnings: ['This note appears to be a duplicate. Avoid redundant coding.'],
          },
        },
        promptType: 'DUPLICATE',
        scenarioTags,
        rawMatches: matches,
      };
    }

    if (scenarioTags.includes('conflict')) {
      warnings.push('Conflicting coding decisions found in history. Exercise caution.');
      context = filtered
        .filter((m) => m.scenarioTags.includes('conflict'))
        .slice(0, 3)
        .map((m) => ({
          type: 'conflicting_history',
          content: m.match.content.substring(0, 200) + '...',
          metadata: {
            visitType: m.match.metadata.visitType,
            specialty: m.match.metadata.specialty,
          },
          score: m.boostScore,
        }));

      return {
        prompt: {
          system:
            'You are a medical coding assistant. Conflicting prior decisions detected. Explain reasoning clearly.',
          user: {
            currentNote,
            context,
            warnings,
          },
        },
        promptType: 'CONFLICTING',
        scenarioTags,
        rawMatches: matches,
      };
    }

    if (scenarioTags.includes('manual_override')) {
      context = filtered
        .filter((m) => m.match.manualCodes.length > 0)
        .map((m) => ({
          type: 'manual_codes',
          content: `Manual codes: ${m.match.manualCodes.map((mc) => `${mc.code} (${mc.codeType})`).join(', ')}`,
        }));

      return {
        prompt: {
          system:
            'Manual codes were used in prior notes. Prioritize consistency unless contradicted.',
          user: {
            currentNote,
            context,
            warnings,
          },
        },
        promptType: 'MANUAL_OVERRIDE',
        scenarioTags,
        rawMatches: matches,
      };
    }

    const topMatch = filtered[0];
    if (topMatch.boostScore >= strong && filtered.length === 1) {
      const m = topMatch.match;
      context = [
        {
          type: 'strong_match',
          content: m.content,
          metadata: {
            visitType: m.metadata.visitType,
            specialty: m.metadata.specialty,
          },
          score: topMatch.boostScore,
        },
      ];

      return {
        prompt: {
          system: 'High-confidence match found. Reuse its coding logic unless contradicted.',
          user: {
            currentNote,
            context,
            warnings,
          },
        },
        promptType: 'STRONG_SINGLE',
        scenarioTags,
        rawMatches: matches,
      };
    }

    if (filtered.length > 1) {
      context = filtered.slice(0, 3).map((m) => ({
        type: 'similar_note',
        content: m.match.content.substring(0, 150) + '...',
        score: m.boostScore,
      }));

      return {
        prompt: {
          system:
            'Multiple relevant notes found. Aggregate consistent codes and flag discrepancies.',
          user: {
            currentNote,
            context,
            warnings,
          },
        },
        promptType: 'MULTI_MATCH',
        scenarioTags,
        rawMatches: matches,
      };
    }

    // Default case: longitudinal pattern
    context = filtered.slice(0, k).map((m) => ({
      type: 'historical',
      content: m.match.content,
      score: m.boostScore,
    }));

    return {
      prompt: {
        system: 'Use historical patterns from the same patient or provider to inform coding.',
        user: {
          currentNote,
          context,
          warnings,
        },
      },
      promptType: 'LONGITUDINAL',
      scenarioTags,
      rawMatches: matches,
    };
  }
}
