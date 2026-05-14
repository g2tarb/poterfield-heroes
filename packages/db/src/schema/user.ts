import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { notificationKindEnum, xpEventKindEnum } from "./enums";
import { levels } from "./content";

// =============================================================
// USER STATE (single row : c'est mono-user)
// =============================================================
export const userState = pgTable("user_state", {
  id: integer("id").primaryKey().default(1), // toujours 1
  displayName: varchar("display_name", { length: 80 }).notNull(),
  email: varchar("email", { length: 255 }),
  avatarUrl: text("avatar_url"),
  currentXp: integer("current_xp").notNull().default(0),
  currentLevelId: integer("current_level_id").references(() => levels.id),
  streakDays: integer("streak_days").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  targetCompletionDate: timestamp("target_completion_date", {
    withTimezone: true,
  }),
  preferences: jsonb("preferences").$type<{
    voiceTts?: boolean;
    accentColor?: string;
    reducedMotion?: boolean;
    dailySrsTarget?: number;
    notifTimes?: { srsReminder?: string; eveningCheckin?: string };
  }>(),
});

// =============================================================
// XP EVENTS (audit trail des gains d'XP)
// =============================================================
export const xpEvents = pgTable(
  "xp_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: xpEventKindEnum("kind").notNull(),
    xpAmount: integer("xp_amount").notNull(),
    sourceRef: text("source_ref"), // ex: "module:m05", "exam:2026-W19"
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    kindIdx: index("idx_xp_kind").on(table.kind),
    occurredIdx: index("idx_xp_occurred").on(table.occurredAt),
  }),
);

// =============================================================
// PUBLIC PROFILE (single row, vitrine partageable read-only)
// =============================================================
export const publicProfile = pgTable("public_profile", {
  id: integer("id").primaryKey().default(1),
  slug: varchar("slug", { length: 80 }).notNull().unique(), // URL: /p/{slug}
  bio: text("bio"),
  tagline: varchar("tagline", { length: 200 }),
  pitchMarkdown: text("pitch_markdown"), // description BelieveMy en public
  isPublished: boolean("is_published").notNull().default(false),
  showRadar: boolean("show_radar").notNull().default(true),
  showStreak: boolean("show_streak").notNull().default(true),
  showStack: boolean("show_stack").notNull().default(true),
  showProjects: boolean("show_projects").notNull().default(false),
  customAccentHex: varchar("custom_accent_hex", { length: 7 }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// =============================================================
// NOTIFICATIONS (rappels SRS, contrôle, etc.)
// =============================================================
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: notificationKindEnum("kind").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    href: text("href"), // deep link in-app
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    pushSent: boolean("push_sent").notNull().default(false),
    readAt: timestamp("read_at", { withTimezone: true }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    scheduledIdx: index("idx_notif_scheduled").on(table.scheduledFor),
    sentIdx: index("idx_notif_sent").on(table.sentAt),
    kindIdx: index("idx_notif_kind").on(table.kind),
  }),
);

export type UserState = typeof userState.$inferSelect;
export type NewUserState = typeof userState.$inferInsert;

export type XpEvent = typeof xpEvents.$inferSelect;
export type NewXpEvent = typeof xpEvents.$inferInsert;

export type PublicProfile = typeof publicProfile.$inferSelect;
export type NewPublicProfile = typeof publicProfile.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

// =============================================================
// PUSH SUBSCRIPTIONS (Web Push, 1 par appareil)
// =============================================================
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    failureCount: integer("failure_count").notNull().default(0),
  },
);

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type NewPushSubscription = typeof pushSubscriptions.$inferInsert;
