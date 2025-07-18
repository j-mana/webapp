import { init, id } from '@instantdb/react';
import schema from "../instant.schema"

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;

if (!APP_ID) {
  throw new Error('NEXT_PUBLIC_INSTANT_APP_ID is not set. Please add it to your .env.local file');
}

const db = init({ appId: APP_ID, schema });

export { id, db };