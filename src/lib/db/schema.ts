import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  time,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ── Enums ── */

export const poolTypeEnum = pgEnum("pool_type", ["public", "private"]);

export const scheduleSourceEnum = pgEnum("schedule_source", [
  "crawled",
  "user_report",
  "official",
]);

/* ── 수영장 기본 정보 ── */

export const pools = pgTable("pools", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  type: poolTypeEnum("type"),
  indoor: boolean("indoor"),
  sido: text("sido").notNull(),
  sidoSlug: text("sido_slug").notNull(),
  sigungu: text("sigungu").notNull(),
  sigunguSlug: text("sigungu_slug").notNull(),
  address: text("address"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  phone: text("phone"),
  website: text("website"),
  laneCount: integer("lane_count"),
  poolArea: decimal("pool_area", { precision: 10, scale: 2 }),
  poolLength: integer("pool_length"),
  safetyGrade: text("safety_grade"),
  isOperating: boolean("is_operating").default(true),
  sourceApi: text("source_api"),
  sourceId: text("source_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ── 자유수영 시간표 ── */

export const freeSwimSchedules = pgTable("free_swim_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  poolId: uuid("pool_id")
    .notNull()
    .references(() => pools.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0=일, 1=월, ..., 6=토
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  maxCapacity: integer("max_capacity"),
  notes: text("notes"),
  source: scheduleSourceEnum("source"),
  verifiedAt: timestamp("verified_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ── 이용 요금 ── */

export const poolPrices = pgTable("pool_prices", {
  id: uuid("id").defaultRandom().primaryKey(),
  poolId: uuid("pool_id")
    .notNull()
    .references(() => pools.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // '성인', '청소년', '어린이'
  period: text("period").notNull(), // '1회', '1개월', '3개월'
  price: integer("price").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ── 리뷰 ── */

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  poolId: uuid("pool_id")
    .notNull()
    .references(() => pools.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1~5
  content: text("content"),
  authorName: text("author_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ── Relations ── */

export const poolsRelations = relations(pools, ({ many }) => ({
  schedules: many(freeSwimSchedules),
  prices: many(poolPrices),
  reviews: many(reviews),
}));

export const freeSwimSchedulesRelations = relations(
  freeSwimSchedules,
  ({ one }) => ({
    pool: one(pools, {
      fields: [freeSwimSchedules.poolId],
      references: [pools.id],
    }),
  })
);

export const poolPricesRelations = relations(poolPrices, ({ one }) => ({
  pool: one(pools, {
    fields: [poolPrices.poolId],
    references: [pools.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  pool: one(pools, {
    fields: [reviews.poolId],
    references: [pools.id],
  }),
}));

/* ── Types ── */

export type Pool = typeof pools.$inferSelect;
export type NewPool = typeof pools.$inferInsert;
export type FreeSwimSchedule = typeof freeSwimSchedules.$inferSelect;
export type PoolPrice = typeof poolPrices.$inferSelect;
export type Review = typeof reviews.$inferSelect;
