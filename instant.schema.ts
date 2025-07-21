// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  // We inferred 2 attributes!
  // Take a look at this schema, and if everything looks good,
  // run `push schema` again to enforce the types.
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    websites: i.entity({
      capturedAt: i.date().optional(),
      html: i.string().optional(),
      rawComputedStyle: i.json().optional(),
      screenshot: i.string().optional(),
      styleGuide: i.json().optional(),
      title: i.string().optional(),
      url: i.string().optional(),
    }),
    projects: i.entity({
      name: i.string(),
      createdAt: i.number().indexed(), // IMPORTANT: Use i.number() for timestamps, not i.date()
    }),
    experiments: i.entity({
      name: i.string(),
      url: i.string(),
      bookmarkedAt: i.number().optional(), // IMPORTANT: Use i.number() for timestamps, not i.date()
      createdAt: i.number().indexed(), // IMPORTANT: Use i.number() for timestamps, not i.date()
    }),
    chatMessages: i.entity({
      message: i.string(),
      role: i.string(),
      createdAt: i.number().indexed(), // IMPORTANT: Use i.number() for timestamps, not i.date()
    }),
    canvasNodes: i.entity({
      type: i.string(), // 'screenshot', 'text', etc.
      x: i.number(),
      y: i.number(),
      width: i.number().optional(),
      height: i.number().optional(),
      data: i.json(), // stores node-specific data like screenshot URL, text content, etc.
      createdAt: i.number().indexed(), // IMPORTANT: Use i.number() for timestamps, not i.date()
    }),
  },
  links: {
    projectExperiments: {
      forward: { on: 'projects', has: 'many', label: 'experiments' },
      reverse: { on: 'experiments', has: 'one', label: 'project' }
    },
    experimentChatMessages: {
      forward: { on: 'experiments', has: 'many', label: 'chatMessages' },
      reverse: { on: 'chatMessages', has: 'one', label: 'experiment' }
    },
    experimentCanvasNodes: {
      forward: { on: 'experiments', has: 'many', label: 'canvasNodes' },
      reverse: { on: 'canvasNodes', has: 'one', label: 'experiment' }
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
