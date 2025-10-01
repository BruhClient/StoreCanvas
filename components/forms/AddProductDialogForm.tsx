import {
  CreateProductPayload,
  CreateProductSchema,
} from "@/schemas/create-product";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MotionDiv } from "../Motion";
import { containerVariants } from "@/lib/variants";
import { AnimatePresence } from "framer-motion";
import { showErrorToast } from "@/lib/toast";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { CreateStorePayload } from "@/schemas/create-store";
import ProductInformationForm from "./ProductInformationForm";
import ProductVariantsForm from "./ProductVariantsForm";
import ProductDescriptionForm from "./ProductDescriptionForm";
import { Form } from "../ui/form";

const steps = [
  {
    title: "Product Information",
    description:
      "Provide the essential details of your product, including its name, price, and an image to represent it.",
    fields: ["productName", "price", "images"],
  },
  {
    title: "Product Description",
    description: "Tell us more about your product.",
    fields: ["description"],
  },
  {
    title: "Product Categories",
    description:
      "Assign your product to one or more categories (e.g., Cakes, Pastries, Beverages) so customers can browse easily.",
    fields: ["categories"],
  },
  {
    title: "Add Variants",
    description:
      "Create product variants with different options (e.g., size, flavor, or color). You can also decide if customers can select multiple options.",
    fields: ["variants"],
  },
];

const Step = ({ children }: { children: React.ReactNode }) => {
  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-[300px] overflow-y-auto space-y-3 "
    >
      {children}
    </MotionDiv>
  );
};

const AddProductDialogForm = ({
  updateProduct,
  values,
  isDialogOpen,
  productCategories,
}: {
  updateProduct: (product: CreateProductPayload, isEdit: boolean) => void;
  values?: CreateProductPayload;
  isDialogOpen: boolean;
  productCategories: string[];
}) => {
  const form = useForm<CreateProductPayload>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      productName: "",
      price: 0,
      categories: [],
      variants: [],
      images: [],
    },
  });

  // Reset on open/close
  useEffect(() => {
    if (isDialogOpen) {
      if (values) {
        form.reset(values); // editing
      } else {
        form.reset({
          productName: "",
          price: 0,
          categories: [],
          variants: [],
          images: [],
          description: "",
        }); // adding
      }
    }
  }, [isDialogOpen, values]);

  const [currentStep, setCurrentStep] = useState(0);

  const next = async () => {
    if (currentStep < steps.length - 1) {
      //@ts-ignore
      const isValid = await form.trigger(steps[currentStep].fields);

      if (!isValid) {
        const fieldErrors = steps[currentStep].fields
          //@ts-ignore
          .map((field) => form.getFieldState(field).error?.message)
          .filter(Boolean);

        showErrorToast(fieldErrors.join(", "));
        return;
      } else {
        setCurrentStep((step) => step + 1);
      }
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleSubmit = async () => {
    const product = form.getValues();
    updateProduct(product, !!values); // pass isEdit flag
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{steps[currentStep].title}</DialogTitle>
        <DialogDescription>{steps[currentStep].description}</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <Step key={"step-1"}>
              <ProductInformationForm form={form} />
            </Step>
          )}

          {currentStep === 1 && (
            <Step key={"step-1"}>
              <ProductDescriptionForm form={form} />
            </Step>
          )}
          {currentStep === 2 && (
            <Step key={"step-2"}>
              <div className="flex gap-2 flex-wrap">
                {productCategories?.map((category) => {
                  const selectedCategories = form.watch("categories");
                  const isSelected = selectedCategories.includes(category);

                  return (
                    <Button
                      key={category}
                      type="button"
                      onClick={() => {
                        const newCategories = isSelected
                          ? selectedCategories.filter((c) => c !== category)
                          : [...selectedCategories, category];

                        form.setValue("categories", newCategories, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      variant={isSelected ? "default" : "outline"}
                    >
                      {category}
                    </Button>
                  );
                })}
              </div>
            </Step>
          )}
          {currentStep === 3 && (
            <Step key={"step-3"}>
              <ProductVariantsForm form={form} />
            </Step>
          )}
        </AnimatePresence>

        <div className="flex justify-between">
          <Button
            onClick={prev}
            variant={"ghost"}
            size={"icon"}
            disabled={currentStep === 0}
          >
            <ChevronLeft />
          </Button>
          {currentStep >= steps.length - 1 ? (
            <Button onClick={handleSubmit}>
              {values ? "Update Product" : "Add Product"}
            </Button>
          ) : (
            <Button onClick={next} variant={"ghost"} size={"icon"}>
              <ChevronRight />
            </Button>
          )}
        </div>
      </Form>
    </>
  );
};

export default AddProductDialogForm;
