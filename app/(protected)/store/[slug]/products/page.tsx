import OnboardingTour from "@/components/OnboardingTour";
import ProductFilter from "./_component/ProductFilter";
import ProductGrid from "./_component/ProductGrid";

const productSteps = [
  {
    target: ".create-product-button", // ✅ match your real button class
    content: "Click here to create a new product",
    disableBeacon: true,
  },
  {
    target: ".create-product-category-button", // ✅ match your real button class
    content: "Click here to create a new product category.",
    disableBeacon: true,
  },
  {
    target: ".product-filters", // ✅ match your real button class
    content: "Filter your products by search or category.",
    disableBeacon: true,
  },

  {
    target: ".product-feed",
    content:
      "This is your payment feed, where all payment options are displayed.",
    disableBeacon: true,
  },
];
const ProductsPage = async () => {
  return (
    <div className="space-y-4">
      <ProductFilter />
      <ProductGrid />
      <OnboardingTour steps={productSteps} id="products" />
    </div>
  );
};

export default ProductsPage;
