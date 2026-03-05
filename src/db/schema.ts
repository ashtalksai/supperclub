import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  decimal,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const dinnerStatusEnum = pgEnum("dinner_status", [
  "planning",
  "confirmed",
  "completed",
  "cancelled",
]);

export const inviteStatusEnum = pgEnum("invite_status", [
  "pending",
  "accepted",
  "declined",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dinners = pgTable("dinners", {
  id: uuid("id").defaultRandom().primaryKey(),
  hostId: uuid("host_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  dietaryPrefs: text("dietary_prefs"),
  guestCount: integer("guest_count").notNull().default(4),
  status: dinnerStatusEnum("status").notNull().default("planning"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  dinnerId: uuid("dinner_id")
    .references(() => dinners.id)
    .notNull(),
  email: text("email").notNull(),
  userId: uuid("user_id").references(() => users.id),
  status: inviteStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const restaurants = pgTable("restaurants", {
  id: uuid("id").defaultRandom().primaryKey(),
  dinnerId: uuid("dinner_id")
    .references(() => dinners.id)
    .notNull(),
  name: text("name").notNull(),
  cuisine: text("cuisine").notNull(),
  priceRange: integer("price_range").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  location: text("location"),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    dinnerId: uuid("dinner_id")
      .references(() => dinners.id)
      .notNull(),
    restaurantId: uuid("restaurant_id")
      .references(() => restaurants.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueVote: uniqueIndex("unique_vote_idx").on(
      table.dinnerId,
      table.restaurantId,
      table.userId
    ),
  })
);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Dinner = typeof dinners.$inferSelect;
export type NewDinner = typeof dinners.$inferInsert;
export type Invite = typeof invites.$inferSelect;
export type Restaurant = typeof restaurants.$inferSelect;
export type Vote = typeof votes.$inferSelect;
