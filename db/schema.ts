import { CreateAdditionalFieldsPayload } from "@/schemas/create-addtional-fields";
import { VariantPayload } from "@/schemas/create-variant";
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

// -------------------- Accounts --------------------
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

// -------------------- Verification Tokens --------------------
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    emailReplaced: text("emailReplaced"),
  },
  (vt) => [{ compositePk: primaryKey({ columns: [vt.identifier, vt.token] }) }]
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
  ownerId: text("ownerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  currency: text("currency").notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  allowComments: boolean("allowComments").default(false),
  connectedStripeAccountId: text("connectedStripeAccountId"),
  telegram: text("telegram"),
  phoneNumber: text("phoneNumber"),
  whatsapp: text("whatsapp"),
  instagram: text("instagram"),
  tiktok: text("tiktok"),
  address: text("address"),
  description: text("description"),
  additionalFields:
    jsonb("additionalFields").$type<CreateAdditionalFieldsPayload[]>(),
});

export const storesRelations = relations(stores, ({ many, one }) => ({
  user: one(users, { fields: [stores.ownerId], references: [users.id] }),
  products: many(products),
  categories: many(storeCategories),
}));

// -------------------- Store Categories --------------------
export const storeCategories = pgTable("store_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const storeCategoriesRelations = relations(
  storeCategories,
  ({ one }) => ({
    store: one(stores, {
      fields: [storeCategories.storeId],
      references: [stores.id],
    }),
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

export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    store: one(stores, {
      fields: [productCategories.storeId],
      references: [stores.id],
    }),
  })
);

// -------------------- Products --------------------
export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  storeId: text("storeId")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  images: json("images").$type<string[]>(),
  description: text("description"),
  variants: jsonb("variants").$type<VariantPayload[]>(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
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
export const productRelations = relations(products, ({ one, many }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  productToCategories: many(productToCategories), // junction table
}));

export const productToCategoriesRelations = relations(
  productToCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productToCategories.productId],
      references: [products.id],
    }),
    category: one(productCategories, {
      fields: [productToCategories.categoryId],
      references: [productCategories.id],
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
  extraFields: jsonb("extraFields").notNull().default("{}"),
});

export const paymentCards = pgTable("paymentCards", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
