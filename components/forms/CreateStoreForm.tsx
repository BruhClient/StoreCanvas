"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import StoreInformationForm from "./StoreInformationForm";
import StoreDescriptionForm from "./StoreDescriptionForm";
import StoreSocialsForm from "./StoreSocialsForm";
import AddProductCategoriesForm from "./AddProductCategoriesForm";
import AddProductForm from "./AddProductForm";
import AdditionalFieldsForm from "./AdditionalFieldsForm";

import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MotionDiv } from "../Motion";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";

import { createStore, getStoreByName } from "@/server/db/stores";
import { deleteFileFromUploadthing } from "@/server/actions/uploadthing";
import { toSlug } from "@/lib/slug";
import { useUploadThing } from "@/lib/uploadthing";

import {
  StoreInformationPayload,
  StoreInformationSchema,
  StoreDescriptionPayload,
  StoreDescriptionSchema,
  StoreSocialsPayload,
  StoreSocialsSchema,
  ProductCategoriesPayload,
  ProductCategoriesSchema,
  AddProductsPayload,
  AddProductsSchema,
  AdditionalFieldsPayload,
  AdditionalFieldsSchema,
} from "@/schemas/store-steps";
import { formTransitionVariants } from "@/lib/variants";
import { CreateStorePayload } from "@/schemas/create-store";

// Wrap step content with motion
const Step = ({ children }: { children: React.ReactNode }) => (
  <MotionDiv
    variants={formTransitionVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="h-[390px] overflow-y-auto"
  >
    {children}
  </MotionDiv>
);

const CreateStoreForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [isCreatingStore, setIsCreatingStore] = useState(false);

  const { startUpload: uploadStoreImages } = useUploadThing("storeImages");
  const { startUpload: uploadProductImages } = useUploadThing("productImages");

  // Step-specific forms
  const storeInfoForm = useForm<StoreInformationPayload>({
    resolver: zodResolver(StoreInformationSchema),
    defaultValues: { storeName: "", currency: "USD", imageFile: null },
    mode: "onBlur",
  });

  const storeDescForm = useForm<StoreDescriptionPayload>({
    //@ts-ignore
    resolver: zodResolver(StoreDescriptionSchema),
    defaultValues: { description: "", allowComments: false },
    mode: "onBlur",
  });

  const storeSocialsForm = useForm<StoreSocialsPayload>({
    //@ts-ignore
    resolver: zodResolver(StoreSocialsSchema),
    defaultValues: {
      instagram: null,
      tiktok: null,
      whatsapp: null,
      telegram: null,
      phoneNumber: null,
      address: null,
    },
    mode: "onBlur",
  });

  const productCategoriesForm = useForm<ProductCategoriesPayload>({
    //@ts-ignore
    resolver: zodResolver(ProductCategoriesSchema),
    defaultValues: { categories: [] },
    mode: "onBlur",
  });

  const addProductsForm = useForm<AddProductsPayload>({
    //@ts-ignore
    resolver: zodResolver(AddProductsSchema),
    defaultValues: { products: [] },
    mode: "onBlur",
  });

  const additionalFieldsForm = useForm<AdditionalFieldsPayload>({
    //@ts-ignore
    resolver: zodResolver(AdditionalFieldsSchema),
    defaultValues: { additionalFields: [] },
    mode: "onBlur",
  });

  const stepForms = [
    storeInfoForm,
    storeDescForm,
    storeSocialsForm,
    productCategoriesForm,
    addProductsForm,
    additionalFieldsForm,
  ];

  const stepMeta = [
    {
      title: "Store Information",
      description:
        "Tell us about your store. Add a name, preferred currency, and a store image.",
      component: StoreInformationForm,
    },
    {
      title: "Store Description",
      description: "Add a description and decide if you allow comments.",
      component: StoreDescriptionForm,
    },
    {
      title: "Social Media",
      description: "Add your social media accounts and contact info.",
      component: StoreSocialsForm,
    },
    {
      title: "Product Categories",
      description: "Organize your products by categories.",
      component: AddProductCategoriesForm,
    },
    {
      title: "Add Products",
      description:
        "Add the products you sell. Each product can be tied to one or more categories.",
      component: AddProductForm,
    },
    {
      title: "Additional Information",
      description:
        "Collect extra info from customers like special instructions.",
      component: AdditionalFieldsForm,
    },
  ];

  const handleNext = async () => {
    const currentForm = stepForms[currentStep];
    const isValid = await currentForm.trigger();
    if (!isValid) {
      const errors = Object.values(currentForm.formState.errors)
        .map((e) => e?.message)
        .filter(Boolean);
      showErrorToast(errors.join(", "));
      return;
    }

    // Step 0: check store name availability
    if (currentStep === 0) {
      const id = showLoadingToast("Checking store name...");
      try {
        setIsPending(true);
        const existing = await getStoreByName(
          storeInfoForm.getValues("storeName")
        );
        toast.dismiss(id);
        if (existing) {
          showErrorToast("Store name is already taken");
          return;
        } else {
          showSuccessToast("Store name is available");
        }
      } catch {
        toast.dismiss(id);
        showErrorToast("Failed to check store name");
      } finally {
        setIsPending(false);
      }
    }

    if (currentStep < stepForms.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsCreatingStore(true);
    const uploadedKeys: string[] = [];

    try {
      // Merge all step values
      const finalValues: CreateStorePayload = {
        ...storeInfoForm.getValues(),
        ...storeDescForm.getValues(),
        ...storeSocialsForm.getValues(),
        ...productCategoriesForm.getValues(),
        ...addProductsForm.getValues(),
        ...additionalFieldsForm.getValues(),
      };

      // Upload store image
      if (finalValues.imageFile) {
        const uploaded = await uploadStoreImages([
          finalValues.imageFile as File,
        ]);

        if (!uploaded) {
          throw Error("Failed to upload images");
        }
        finalValues.imageFile = uploaded?.[0]?.ufsUrl ?? null;
        uploadedKeys.push(...uploaded.map((f) => f.key));
      }

      // Upload product images
      finalValues.products = await Promise.all(
        finalValues.products.map(async (p) => {
          if (!p.images || p.images.length === 0) return p;
          const uploaded = await uploadProductImages(p.images as File[]);
          if (!uploaded) {
            throw Error("Failed to upload images");
          }
          uploadedKeys.push(...uploaded.map((f) => f.key));
          return { ...p, images: uploaded.map((f) => f.ufsUrl) };
        })
      );

      const res = await createStore(finalValues);
      if (res.error || !res.store) throw Error(res.error || "Failed");

      showSuccessToast("Store successfully created!");
      stepForms.forEach((f) => f.reset());
      router.push(`/store/${toSlug(finalValues.storeName)}`);
    } catch (err: any) {
      console.error(err);
      await Promise.allSettled(
        uploadedKeys.map((k) => deleteFileFromUploadthing(k))
      );
      showErrorToast(err.message || "Upload failed");
    } finally {
      setIsCreatingStore(false);
    }
  };

  if (isCreatingStore) return <div>Loading...</div>;

  const CurrentStepComponent = stepMeta[currentStep].component;

  return (
    //@ts-ignore
    <FormProvider {...stepForms[currentStep]}>
      <form className="flex flex-col gap-4 mx-auto w-full max-w-[400px]">
        {/* Step header */}
        <div className="space-y-2">
          <div className="text-3xl font-bold">
            {stepMeta[currentStep].title}
          </div>
          <div className="text-sm font-serif text-muted-foreground">
            {stepMeta[currentStep].description}
          </div>
        </div>

        {/* Step content with AnimatePresence */}
        <AnimatePresence mode="wait">
          <Step key={currentStep}>
            {/* @ts-ignore */}
            <CurrentStepComponent form={stepForms[currentStep]} />
          </Step>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
            disabled={currentStep === 0}
          >
            <ChevronLeft />
          </Button>

          <Button
            type="button"
            size={currentStep === stepForms.length - 1 ? "default" : "icon"}
            variant="ghost"
            disabled={isPending}
            onClick={handleNext}
          >
            {currentStep === stepForms.length - 1 ? (
              <>
                Create Store <ChevronRight />
              </>
            ) : (
              <ChevronRight />
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateStoreForm;
