import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const ping = await prisma.ping.create({ data: { text: 'pong from db' } });
  return NextResponse.json(ping);
}
