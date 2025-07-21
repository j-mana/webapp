import { openai } from "@ai-sdk/openai";
import { init } from "@instantdb/admin";
import { generateText, streamText } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
// ID for app: Manafold
const APP_ID = '3a4c7162-eb2c-49f3-a422-1c0f6b4ba430';
const db = init({
  appId: APP_ID,
  adminToken: process.env.INSTANT_APP_ADMIN_TOKEN!,
});

export async function POST(req: NextRequest) {
  const { experimentId, goal } = await req.json();

  const result = generateText({
    model: openai('gpt-4o'),
    system: 'You are an ai in UI/UX A/B testing platform. You name an experiemnt based on the user\'s goal that they have inputted in natural language',
    messages: [
      {
        role: 'user',
        content: goal,
      },
    ],
    tools: {
      nameExperiment: {
        description: 'Name an experiment based on the user\'s goal',
        parameters: z.object({
          name: z.string(),
        }),
      },
    },
    toolChoice: { type: 'tool', toolName: 'nameExperiment' },
  });

  const { toolCalls } = await result;

  await db.transact(db.tx.experiments[experimentId].update({
    name: toolCalls[0].args.name,
  }));

  return NextResponse.json({ name: toolCalls[0].args.name });
}