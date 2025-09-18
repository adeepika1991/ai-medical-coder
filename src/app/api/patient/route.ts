import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const patient = await prisma.patient.findFirst({
      select: {
        name: true,
        dob: true,
        insurance: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'No patient found' }, { status: 404 });
    }

    return NextResponse.json(patient, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
