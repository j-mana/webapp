import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateId } from "@/lib/db";

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

  const messageId = generateId();
  await supabaseAdmin
    .from('chat_messages')
    .insert({
      id: messageId,
      role: 'assistant',
      message: text,
      experiment_id: experimentId,
      created_at: Date.now(),
    });

  return NextResponse.json({ text });
}