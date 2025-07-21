import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateId } from "@/lib/supabase";
import { DateTime } from "luxon";

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

  await supabaseAdmin
    .from('experiments')
    .update({
      name: experimentName,
    })
    .eq('id', experimentId);

  return NextResponse.json({ name: experimentName });
}