// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Extend global scope to hold prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Reuse existing client in dev; create new one in prod
export const prisma = global.prisma || new PrismaClient();

// In development, persist client across hot reloads
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
