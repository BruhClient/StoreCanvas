import ProductFilter from "./_component/ProductFilter";
import ProductGrid from "./_component/ProductGrid";

const ProductsPage = async ({}: {}) => {
  return (
    <div className="space-y-4">
      <ProductFilter />
      <ProductGrid />
    </div>
  );
};

export default ProductsPage;
