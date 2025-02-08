import {
  text,
  index,
  singlestoreTableCreator,
  bigint,
} from "drizzle-orm/singlestore-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = singlestoreTableCreator((name) => `stash_${name}`);

export const files = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    parent: bigint("parent", { mode: "number", unsigned: true }).notNull(),
    size: text("size").notNull(),
  },
  (t) => {
    return [index("parent_folder").on(t.parent)];
  },
);

export const folders = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: text("name").notNull(),
    parent: bigint("parent", { mode: "number", unsigned: true }),
  },
  (t) => {
    return [index("parent_folder").on(t.parent)];
  },
);
