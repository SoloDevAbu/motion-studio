import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    prompt: text("prompt").notNull(),
    aspectRatio: text("aspect_ratio").default("9:16").notNull(),
    theme: text("theme").default("dark-neon").notNull(),
    voiceId: text("voice_id").default("en-US-ChristopherNeural").notNull(),
    fps: integer("fps").default(30).notNull(),
    audioUrl: text("audio_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("projects_user_id_idx").on(table.userId),
  }),
);

export const scenes = pgTable(
  "scenes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    orderIndex: integer("order_index").notNull(),
    type: text("type").notNull(),
    voiceoverText: text("voiceover_text").notNull(),
    durationFrames: integer("duration_frames").notNull(),
    layoutPayload: jsonb("layout_payload").notNull(),
    wordTimestamps: jsonb("word_timestamps").notNull(),
  },
  (table) => ({
    projectIdIdx: index("scenes_project_id_idx").on(table.projectId),
    orderIdx: index("scenes_order_idx").on(table.projectId, table.orderIndex),
  }),
);

export const exports = pgTable(
  "exports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    format: text("format").default("mp4").notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    renderedClientSide: boolean("rendered_client_side").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    projectIdIdx: index("exports_project_id_idx").on(table.projectId),
  }),
);

// ── Relations ─────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  scenes: many(scenes),
  exports: many(exports),
}));

export const scenesRelations = relations(scenes, ({ one }) => ({
  project: one(projects, {
    fields: [scenes.projectId],
    references: [projects.id],
  }),
}));

export const exportsRelations = relations(exports, ({ one }) => ({
  project: one(projects, {
    fields: [exports.projectId],
    references: [projects.id],
  }),
}));
