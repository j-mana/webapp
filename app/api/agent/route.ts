import { NextRequest, NextResponse } from "next/server"
import { streamText, generateText } from "ai";
import { openai } from '@ai-sdk/openai';
import { init, id } from "@instantdb/admin";
import { DateTime } from "luxon";
// ID for app: Manafold
const APP_ID = '3a4c7162-eb2c-49f3-a422-1c0f6b4ba430';
const db = init({
  appId: APP_ID,
  adminToken: process.env.INSTANT_APP_ADMIN_TOKEN!,
});

export async function POST(req: NextRequest) {
  const { messages, experimentId } = await req.json();

  const {text} = await generateText({
    model: openai('gpt-4o'),
    system: 'You are a generative UX platform for marketing teams to run experiments. Your name is Manafold AI.',
    messages,
  });

  const messageId = id();
  await db.transact(
    db.tx.chatMessages[messageId].update({
      role: 'assistant',
      message: text,
      createdAt: DateTime.now().toISO(),
    }).link({ experiment: experimentId })
  );

  return NextResponse.json({ text });
}