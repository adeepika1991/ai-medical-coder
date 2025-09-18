import { BoostResult, SOAPMatch } from '@/types/types';

export class BoostScorer {
  private config = {
    strongMatchThreshold: 0.9,
    recentDays: 90,
    conflictPenalty: -0.12,
    manualCodeBoost: 0.08,
    visitTypeMatchBoost: 0.1,
    sameProviderBoost: 0.1,
    recentBoost: 0.05,
  };

  score(matches: SOAPMatch[], currentDoctorId: string): BoostResult[] {
    const now = new Date();

    return matches
      .map((match): BoostResult => {
        let boostScore = match.similarityScore;
        const scenarioTags: string[] = [];

        // Recency boost
        const ageInDays =
          (now.getTime() - match.noteMetadata.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (ageInDays < this.config.recentDays) {
          boostScore += this.config.recentBoost;
          scenarioTags.push('recent');
        }

        // Same provider boost
        if (match.noteMetadata.doctorId === currentDoctorId) {
          boostScore += this.config.sameProviderBoost;
          scenarioTags.push('same_provider');
        }

        // Visit type match
        if (match.noteMetadata.visitType === this.getVisitType(match)) {
          boostScore += this.config.visitTypeMatchBoost;
          scenarioTags.push('same_visit_type');
        }

        // Manual codes boost
        if (match.manualCodes.length > 0) {
          boostScore += this.config.manualCodeBoost;
          scenarioTags.push('manual_override');
        }

        // Conflict detection
        if (this.hasConflict(match)) {
          boostScore += this.config.conflictPenalty;
          scenarioTags.push('conflict');
        }

        // Normalize
        boostScore = Math.max(0, Math.min(1, boostScore));

        return {
          match,
          boostScore,
          scenarioTags,
        };
      })
      .sort((a, b) => b.boostScore - a.boostScore);
  }

  private hasConflict(match: SOAPMatch): boolean {
    const accepted = new Set(match.finalizedCodes.map((c) => `${c.codeType}:${c.code}`));
    const rejected = new Set(match.rejectedCodes.map((c) => `${c.codeType}:${c.code}`));
    for (const code of accepted) {
      if (rejected.has(code)) return true;
    }
    return false;
  }

  private getVisitType(match: SOAPMatch): string {
    return match.noteMetadata.visitType || 'OTHER';
  }
}
