import { openai } from "@ai-sdk/openai";
import { init } from "@instantdb/admin";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
// ID for app: Manafold
const APP_ID = '3a4c7162-eb2c-49f3-a422-1c0f6b4ba430';
const db = init({
  appId: APP_ID,
  adminToken: process.env.INSTANT_APP_ADMIN_TOKEN!,
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    prompt: 'You',
    messages,
  });

  const { text } = await result;

  return NextResponse.json({ text });
}