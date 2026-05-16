import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { messages } = body;

  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300
          }
        })
      }
    );

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Signal lost.';
    return NextResponse.json({ reply });

  } catch (e) {
    return NextResponse.json({ reply: 'ARIA offline. Signal interference detected.' });
  }
}
