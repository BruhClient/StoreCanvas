"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStorePayload, CreateStoreSchema } from "@/schemas/create-store";
import StoreInformationForm from "./StoreInformationForm";
import StoreDescriptionForm from "./StoreDescriptionForm";
import StoreSocialsForm from "./StoreSocialsForm";
import AddProductCategoriesForm from "./AddProductCategoriesForm";
import AddProductForm from "./AddProductForm";
import AdditionalFieldsForm from "./AdditionalFieldsForm";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { MotionDiv } from "../Motion";
import { formTransitionVariants } from "@/lib/variants";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";
import { createStore, getStoreByName } from "@/server/db/stores";
import { toast } from "sonner";
import { useFileUploader } from "@/hooks/useFileUploader";
import { deleteFileFromUploadthing } from "@/server/actions/uploadthing";
import { useRouter } from "next/navigation";
import { toSlug } from "@/lib/slug";
import { useUploadThing } from "@/lib/uploadthing";

const Step = ({ children }: { children: React.ReactNode }) => {
  return (
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
};

const steps = [
  {
    title: "Store Information",
    description:
      "Tell us about your store. Add a name, preferred currency, and a store image.",
    fields: ["storeName", "currency", "imageFile"],
  },
  {
    title: "Store Description",
    description: "Add a description and decide if you allow comments.",
    fields: ["description", "allowComments"],
  },
  {
    title: "Social Media",
    description: "Add your social media accounts and contact info.",
    fields: [
      "instagram",
      "tiktok",
      "whatsapp",
      "telegram",
      "phoneNumber",
      "address",
    ],
  },
  {
    title: "Product Categories",
    description: "Organize your products by categories.",
    fields: ["categories"],
  },
  {
    title: "Add Products",
    description:
      "Add the products you sell. Each product can be tied to one or more categories.",
    fields: ["products"],
  },
  {
    title: "Additional Information",
    description: "Collect extra info from customers like special instructions.",
    fields: ["additionalFields"],
  },
];

const CreateStoreForm = () => {
  const form = useForm<CreateStorePayload>({
    resolver: zodResolver(CreateStoreSchema),
    defaultValues: {
      storeName: "",
      imageFile: null,
      currency: "USD",
      tiktok: "",
      instagram: "",
      telegram: "",
      whatsapp: "",
      phoneNumber: "",
      address: "",
      categories: [],
      description: "",
      products: [],
      allowComments: false,
      additionalFields: [],
    },
    mode: "onBlur",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [isCreatingStore, setIsCreatingStore] = useState(false);
  const { startUpload: uploadStoreImages } = useUploadThing("storeImages");
  const { startUpload: uploadProductImages } = useUploadThing("productImages");
  const router = useRouter();
  const onSubmit = async (values: CreateStorePayload) => {
    setIsCreatingStore(true);

    const uploadedFilesKeys: string[] = []; // track all uploaded file URLs

    try {
      // 1. Upload store image
      let storeImageUrl: string | null = null;
      if (values.imageFile) {
        const uploadedStoreFiles = await uploadStoreImages(
          Array.isArray(values.imageFile)
            ? values.imageFile
            : [values.imageFile]
        );
        if (!uploadedStoreFiles) {
          throw Error("Failed to upload store images");
        }
        storeImageUrl = uploadedStoreFiles[0].ufsUrl;
        uploadedFilesKeys.push(uploadedStoreFiles[0].key);
      }

      // 2. Upload product images
      const productsWithUrls = await Promise.all(
        values.products.map(async (product) => {
          if (product.images && product.images.length > 0) {
            const uploadedProductFiles = await uploadProductImages(
              product.images
            );

            if (!uploadedProductFiles) {
              throw Error("Failed to upload product images.");
            }

            const urls = uploadedProductFiles.map((f) => f.ufsUrl);
            const keys = uploadedProductFiles.map((f) => f.key);
            uploadedFilesKeys.push(...keys);
            return { ...product, images: urls };
          } else {
            return { ...product, images: [] };
          }
        })
      );

      // 3. Construct new values object with uploaded URLs
      const valuesWithUrls: CreateStorePayload = {
        ...values,
        imageFile: storeImageUrl,
        products: productsWithUrls,
      };

      console.log("New values with uploaded URLs:", valuesWithUrls);

      const res = await createStore(valuesWithUrls);

      if (res.error || !res.store) {
        throw Error(res.error || "Failed to create store");
      }

      showSuccessToast("Store successfully added");
      form.reset();
      router.push(`/store/${toSlug(values.storeName)}`);
    } catch (err: any) {
      console.error("Upload or processing failed:", err);

      // Delete all uploaded files to prevent orphaned files
      await Promise.all(
        uploadedFilesKeys.map((key) => deleteFileFromUploadthing(key))
      );

      showErrorToast(err.message || "Upload failed and files were deleted.");
    } finally {
      setIsCreatingStore(false);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep].fields;
    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) {
      const fieldErrors = fieldsToValidate
        .map((field) => form.getFieldState(field).error?.message)
        .filter(Boolean);
      showErrorToast(fieldErrors.join(", "));
      return;
    }

    if (currentStep === 0) {
      // show loading toast
      const id = showLoadingToast(
        "Checking Store Name...",
        "Please wait while we check availability."
      );

      try {
        setIsPending(true);
        const store = await getStoreByName(form.getValues("storeName"));

        // remove the loading toast
        toast.dismiss(id);

        if (store) {
          showErrorToast("Store name is already taken");
          return;
        } else {
          showSuccessToast(
            "Store name available",
            "You can continue with this name."
          );
        }
      } catch (error) {
        toast.dismiss(id);
        showErrorToast("Failed to check store name. Please try again.");
      } finally {
        setIsPending(false);
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Last step: submit form programmatically
      form.handleSubmit(onSubmit)();
    }
  };

  if (isCreatingStore) {
    return <div>Loading...</div>;
  }
  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4 mx-auto w-full max-w-[400px]">
        {/* Step Header */}
        <div className="space-y-2">
          <div className="text-3xl font-bold">{steps[currentStep].title}</div>
          <div className="text-sm font-serif text-muted-foreground">
            {steps[currentStep].description}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <div className="h-[400px] overflow-y-auto">
            {currentStep === 0 && (
              <Step>
                <StoreInformationForm />
              </Step>
            )}
            {currentStep === 1 && (
              <Step>
                <StoreDescriptionForm />
              </Step>
            )}
            {currentStep === 2 && (
              <Step>
                <StoreSocialsForm />
              </Step>
            )}
            {currentStep === 3 && (
              <Step>
                <AddProductCategoriesForm />
              </Step>
            )}
            {currentStep === 4 && (
              <Step>
                <AddProductForm />
              </Step>
            )}
            {currentStep === 5 && (
              <Step>
                <AdditionalFieldsForm />
              </Step>
            )}
          </div>
        </AnimatePresence>

        {/* Navigation Buttons */}
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
            size={currentStep === steps.length - 1 ? "default" : "icon"}
            variant="ghost"
            disabled={isPending}
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? (
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
