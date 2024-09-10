import {
  integer,
  varchar,
  serial,
  decimal,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 200 }).primaryKey(),
  name: varchar("name", { length: 50 }),
  age: integer("age"),
  weight: decimal("weight", { precision: 7, scale: 2 }),
  height: decimal("height", { precision: 7, scale: 2 }),
  gender: varchar("gender", { length: 10 }),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  sport: varchar("sport", { length: 50 }),
  duration: varchar("duration", { length: 8 }), // Store duration
  calories: decimal("calories", { precision: 7 }),
  location: varchar("location", { length: 255 }),
  // store postgres timestamp
  time: timestamp("time").defaultNow(),
});

export const weights = pgTable("weights", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id), // Foreign key to users table
  weight: decimal("weight", { precision: 7, scale: 2 }), // User's weight (e.g., 75.50 kg)
  month: integer("month"),
});

export const foodLog = pgTable("food_log", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  food: varchar("food", { length: 100 }),
  amount: varchar("amount", { length: 100 }),
  calories: decimal("calories", { precision: 7, scale: 2 }),
  protein: decimal("protein", { precision: 7, scale: 2 }),
  carbo: decimal("carbo", { precision: 7, scale: 2 }),
  fat: decimal("fat", { precision: 7, scale: 2 }),
  time: timestamp("time").defaultNow(),
});
