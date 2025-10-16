// app/canvas/[slug]/page.tsx
import { Button } from "@/components/ui/button";
import { fromSlug } from "@/lib/slug";
import { getProductCategories } from "@/server/db/productCategories";
import { getProductsByStoreId } from "@/server/db/products";
import { getStoreByName } from "@/server/db/stores";
import { getUserById } from "@/server/db/users";
import { Frown } from "lucide-react";
import Link from "next/link";
import StoreCanvasForm from "./_components/StoreCanvasForm";

const CanvasPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  const store = await getStoreByName(fromSlug(slug));

  if (!store) {
    return (
      <div className="h-screen w-full flex flex-col gap-3 justify-center items-center">
        <Frown size={50} />
        <div className="text-2xl font-semibold">Store not found!</div>
        <Button variant="link" asChild>
          <Link href="/">Back to home page</Link>
        </Button>
      </div>
    );
  }

  const owner = await getUserById(store.ownerId)!;

  const [products, categories] = await Promise.all([
    getProductsByStoreId(store.id),
    getProductCategories(store.id),
  ]);

  return (
    <StoreCanvasForm
      store={store}
      products={products}
      categories={categories}
      owner={owner}
    />
  );
};

export default CanvasPage;
