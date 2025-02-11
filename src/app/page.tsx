import { db } from "~/server/db";
import {
  files as filesSchema,
  folders as foldersSchema,
} from "~/server/db/schema";
import StashContents from "./stash-contents";

export default async function Stash() {
  const files = await db.select().from(filesSchema);
  const folders = await db.select().from(foldersSchema);

  return <StashContents files={files} folders={folders} />;
}
