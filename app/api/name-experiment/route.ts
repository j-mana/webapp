import OpenAI from "openai";
import { init } from "@instantdb/admin";
import { NextRequest, NextResponse } from "next/server";

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
  const { experimentId, goal } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an AI in UI/UX A/B testing platform. You name an experiment based on the user's goal that they have inputted in natural language"
      },
      {
        role: "user",
        content: goal,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "nameExperiment",
          description: "Name an experiment based on the user's goal",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The name of the experiment"
              }
            },
            required: ["name"]
          }
        }
      }
    ],
    tool_choice: { type: "function", function: { name: "nameExperiment" } },
  });

  const toolCall = completion.choices[0].message.tool_calls?.[0];
  if (!toolCall) {
    throw new Error("No tool call returned");
  }

  const args = JSON.parse(toolCall.function.arguments);
  const experimentName = args.name;

  await db.transact(db.tx.experiments[experimentId].update({
    name: experimentName,
  }));

  return NextResponse.json({ name: experimentName });
}