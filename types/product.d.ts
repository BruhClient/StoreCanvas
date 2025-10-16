export type ProductWithCategories = InferSelectModel<typeof products> & {
  categories: string[];
};
