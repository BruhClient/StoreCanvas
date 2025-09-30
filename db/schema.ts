import { CreateAdditionalFieldsPayload } from "@/schemas/create-addtional-fields";
import { VariantOptionPayload, VariantPayload } from "@/schemas/create-variant";
import { relations } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  real,
  jsonb,
  json,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { z } from "zod";

// -------------------- Users --------------------
export const userPlanEnum = pgEnum("userPlan", ["Free", "Pro", "Premium"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isOauth: boolean("isOauth").notNull().default(false),
  hashedPassword: text("hashedPassword"),
  plan: userPlanEnum("plan").default("Free").notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  stores: many(stores),
}));

// -------------------- Accounts & Tokens --------------------
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),

    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    emailReplaced: text("emailReplaced"),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const codeVerificationTokens = pgTable("codeVerificationToken", {
  identifier: text("identifier").notNull().primaryKey(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  code: text("code").notNull(),
});

// -------------------- Stores --------------------
export const stores = pgTable("store", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  currency: text("currency").notNull(),
  ownerId: text("ownerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  allowComments: boolean("allowComments").default(false),
  connectedStripeAccountId: text("connectedStripeAccountId"),
  telegram: text("telegram"),
  phoneNumber: text("phoneNumber"),
  whatsapp: text("whatsapp"),
  instagram: text("instagram"),
  description: text("description"),
  address: text("address"),
  tiktok: text("tiktok"),
  additionalFields:
    jsonb("additionalFields").$type<CreateAdditionalFieldsPayload[]>(),
});

export const storesRelations = relations(stores, ({ many, one }) => ({
  products: many(products),
  user: one(users, { fields: [stores.ownerId], references: [users.id] }),
  categories: many(storeCategories),
}));

// -------------------- Store Categories --------------------
export const storeCategories = pgTable("store_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const storeCategoriesRelations = relations(
  storeCategories,
  ({ one, many }) => ({
    store: one(stores, {
      fields: [storeCategories.storeId],
      references: [stores.id],
    }),
    products: many(products), // optional
  })
);

// -------------------- Product Categories --------------------
export const productCategories = pgTable("productCategory", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// -------------------- Products --------------------
export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  images: json("images").$type<String[]>(),
  description: text("description"),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  variants: jsonb("variants").$type<VariantPayload[]>(),
});

// -------------------- Product ↔ Categories Junction Table --------------------
export const productToCategories = pgTable(
  "productToCategories",
  {
    productId: text("productId")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: text("categoryId")
      .notNull()
      .references(() => productCategories.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey(table.productId, table.categoryId),
  })
);

// -------------------- Relations --------------------
export const productRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
}));

export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    store: one(stores, {
      fields: [productCategories.storeId],
      references: [stores.id],
    }),
  })
);

// -------------------- Orders --------------------
export const orders = pgTable("order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  customerName: text("customerName").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  extraFields: jsonb("extraFields").notNull().default("{}"), // dynamic fields
});
