// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { GenerateSchema } from '@/lib/zodSchemas';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { EmbeddingService } from '@/services/EmbeddingService';
import { BoostScorer } from '@/services/BoostScorer';
import { PromptResolver } from '@/services/PromptResolver';
import { LLMClient } from '@/services/LLMClient';
import { PostLLMProcessor } from '@/services/PostLLMProcessor';

import { DEFAULT_DOCTOR } from '@/lib/doctorConfig';
import type { RawMatch, SOAPMatch } from '@/types/types';

// -------------------------
// 🔐 Rate Limit Config
// -------------------------
const RATE_LIMIT_WINDOW = 15 * 60; // 15 minutes (seconds)
const MAX_REQUESTS = 10;

// -------------------------
// 🛠️ Utils
// -------------------------
async function getCachedEmbedding(content: string): Promise<number[] | null> {
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  const key = `embedding:${hash}`;
  return redis.get<number[]>(key);
}

async function setCachedEmbedding(content: string, embedding: number[]): Promise<void> {
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  const key = `embedding:${hash}`;
  await redis.set(key, embedding, { ex: 30 * 86400 }); // 30 days
}

async function isRateLimited(ip: string): Promise<boolean> {
  const key = `ratelimit:${ip}`;
  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }
  return requests > MAX_REQUESTS;
}

// -------------------------
// 🚀 Main Handler
// -------------------------
export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();

  try {
    // 🔒 Rate Limiting
    if (await isRateLimited(ip)) {
      return NextResponse.json({ error: 'RateLimitExceeded' }, { status: 429 });
    }

    // 📦 Validate Input
    const input = GenerateSchema.parse(await req.json());
    const { soapNote, patientId, specialty, visitType, visitDate, submittedBy } = input;

    // 🔁 Duplicate Detection
    const contentHash = crypto.createHash('sha256').update(soapNote).digest('hex');
    const existingInDb = await prisma.soapNoteRevision.findFirst({
      where: { contentHash },
    });
    if (existingInDb) {
      return NextResponse.json(
        {
          revisionId: existingInDb.id,
          suggestions: [],
          scenarioTags: ['duplicate'],
          promptType: 'DUPLICATE',
        },
        { status: 200 }
      );
    }

    // 🟦 Ensure Patient exists
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: 'PatientNotFound' }, { status: 404 });
    }

    // 🟦 Create Visit
    const visit = await prisma.visit.create({
      data: {
        patientId,
        status: 'IN_PROGRESS',
        type: visitType,
        specialty: specialty,
        date: visitDate ? new Date(visitDate) : new Date(),
        time: new Date().toISOString().slice(11, 19),
        doctorId: DEFAULT_DOCTOR.id,
        doctorName: DEFAULT_DOCTOR.name,
        submittedBy,
      },
    });

    // 🟦 Create SOAP Note
    const soap = await prisma.soapNote.create({
      data: {
        visitId: visit.id,
        content: soapNote,
      },
    });

    // 🟨 Get or Create Embedding
    let embedding: number[] | null = await getCachedEmbedding(soapNote);
    let isNewEmbedding = false;
    if (!embedding) {
      embedding = await new EmbeddingService().getEmbedding(soapNote);
      await setCachedEmbedding(soapNote, embedding);
      isNewEmbedding = true;
    }

    // 🟦 Create Revision
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const revision = await (prisma.soapNoteRevision as unknown as any).create({
      data: {
        soapNoteId: soap.id,
        content: soapNote,
        embedding: embedding as unknown as number[],
        contentHash,
        metadata: { contentHash, source: isNewEmbedding ? 'fresh' : 'cached' },
      },
    });

    // 🟢 Vector Search (Cosine Similarity)
    const oneYearAgo = new Date(Date.now() - 365 * 86400000);
    const embeddingLiteral = `[${embedding.join(',')}]`; // pgvector expects vector literal

    const rawMatches = await prisma.$queryRaw<unknown[]>`
      SELECT 
        snr."id" AS "revisionId",
        snr.content,
        snr."createdAt",
        v."patientId",
        v."doctorId",
        v."doctorName",
        v."specialty",
        v."type" AS "visitType",
        1 - (snr.embedding <#> ${embeddingLiteral}::vector) AS "similarityScore",
        COALESCE((
          SELECT json_agg(json_build_object('code', fc.code, 'codeType', fc."codeType"))
          FROM "FinalizedCode" fc
          JOIN "CodeDecisionSet" cds ON cds.id = fc."decisionSetId"
          WHERE cds."revisionId" = snr."id"
        ), '[]') AS "finalizedCodes",
        COALESCE((
          SELECT json_agg(json_build_object('code', rc.code, 'codeType', rc."codeType", 'reason', rc."reason"))
          FROM "RejectedCode" rc
          JOIN "CodeDecisionSet" cds ON cds.id = rc."decisionSetId"
          WHERE cds."revisionId" = snr."id"
        ), '[]') AS "rejectedCodes",
        COALESCE((
          SELECT json_agg(json_build_object('code', mc.code, 'codeType', mc."codeType"))
          FROM "ManualCode" mc
          JOIN "CodeDecisionSet" cds ON cds.id = mc."decisionSetId"
          WHERE cds."revisionId" = snr."id"
        ), '[]') AS "manualCodes"
      FROM "SoapNoteRevision" snr
      JOIN "SoapNote" sn ON sn.id = snr."soapNoteId"
      JOIN "Visit" v ON v.id = sn."visitId"
      WHERE 
        v."specialty" = ${specialty}
        AND snr."createdAt" >= ${oneYearAgo}
        AND snr."id" != ${revision.id}
      ORDER BY snr.embedding <#> ${embeddingLiteral}::vector
      LIMIT 20
    `;

    // 🟦 Normalize Matches
    const matches: SOAPMatch[] = (rawMatches as RawMatch[]).map((r) => ({
      revisionId: r.revisionId,
      content: r.content,
      similarityScore: Number(r.similarityScore),
      finalizedCodes: r.finalizedCodes ?? [],
      rejectedCodes: r.rejectedCodes ?? [],
      manualCodes: r.manualCodes ?? [],
      metadata: {
        patientId: r.patientId,
        doctorId: r.doctorId,
        doctorName: r.doctorName,
        specialty: r.specialty,
        visitType: r.visitType,
        createdAt: new Date(r.createdAt),
      },
    }));

    // 🟦 Boost & Tag
    const boosted = new BoostScorer().score(matches, DEFAULT_DOCTOR.id);
    const topMatches = boosted.slice(0, 10);

    // 🟦 Resolve Prompt
    const resolvedPrompt = new PromptResolver().resolve({
      currentNote: soapNote,
      matches: topMatches,
      metadata: {
        patientId,
        providerId: submittedBy,
        specialty,
        visitType,
      },
    });

    // 🟡 Call LLM
    let llmOutput = null;
    try {
      llmOutput = await new LLMClient().generate(resolvedPrompt.prompt);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      await new PostLLMProcessor().quarantine(
        error.rawResponse || 'n/a',
        revision.id,
        error.message
      );
    }

    // ✅ Process Suggestions + Log PromptType
    const processor = new PostLLMProcessor();
    const { suggestions } = await processor.process(
      llmOutput,
      revision.id,
      resolvedPrompt.promptType
    );

    return NextResponse.json({
      visitId: visit.id,
      revisionId: revision.id,
      suggestions,
      scenarioTags: resolvedPrompt.scenarioTags,
      promptType: resolvedPrompt.promptType,
    });
  } catch (error: unknown) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    console.error('Error in /generate:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
