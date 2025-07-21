import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai";
import { init, id } from "@instantdb/admin";
import { DateTime } from "luxon";

// ID for app: Manafold
const APP_ID = '3a4c7162-eb2c-49f3-a422-1c0f6b4ba430';
const db = init({
  appId: APP_ID,
  adminToken: process.env.INSTANT_APP_ADMIN_TOKEN!,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { messages, experimentId } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a generative UX platform for marketing teams to run experiments. Your name is Manafold AI."
      },
      ...messages
    ],
  });

  const text = completion.choices[0].message.content;

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