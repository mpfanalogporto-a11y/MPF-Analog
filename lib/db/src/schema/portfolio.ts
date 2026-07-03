import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  shortRole: text("short_role").notNull(),
  bio: text("bio").notNull(),
  instagram: text("instagram").notNull().default(""),
  avatar: text("avatar").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMemberSchema = createInsertSchema(membersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateMemberSchema = insertMemberSchema.partial();
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type UpdateMember = z.infer<typeof updateMemberSchema>;
export type Member = typeof membersTable.$inferSelect;

export const PHOTO_CATEGORIES = [
  "STREET",
  "EVENT",
  "PORTRAIT",
  "LANDSCAPE",
  "DOKUMENTASI",
] as const;

export const photosTable = pgTable("photos", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => membersTable.id, {
    onDelete: "set null",
  }),
  category: text("category").notNull(),
  src: text("src").notNull(),
  title: text("title").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPhotoSchema = createInsertSchema(photosTable).omit({
  id: true,
  createdAt: true,
});
export const updatePhotoSchema = insertPhotoSchema.partial();
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type UpdatePhoto = z.infer<typeof updatePhotoSchema>;
export type Photo = typeof photosTable.$inferSelect;

export const siteSettingsTable = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettingsTable).omit({
  updatedAt: true,
});
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettingsTable.$inferSelect;
