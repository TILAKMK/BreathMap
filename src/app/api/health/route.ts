import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'BreathMap AI backend is running',
    timestamp: new Date().toISOString()
  });
}
