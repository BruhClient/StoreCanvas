import { products } from "@/db/schema";

export type ProductWithCategories = InferSelectModel<typeof products> & {
  categories: string[];
};
