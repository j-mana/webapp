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
  },
  links: {},
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
