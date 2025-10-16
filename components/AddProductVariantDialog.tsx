"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VariantSchema, VariantPayload } from "@/schemas/create-variant";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { MotionDiv } from "./Motion";
import { containerVariants } from "@/lib/variants";
import { showErrorToast } from "@/lib/toast";

import AddVariantOptionForm from "./forms/AddVariantOptionForm";

export default function AddProductVariantDialog({
  productForm,
  values,
  children,
  dialogTitle,
  dialogDescription,
}: {
  productForm: any;
  dialogTitle: string;
  dialogDescription: string;
  children: React.ReactNode;
  values?: VariantPayload;
}) {
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);

  const [optionDialogOpen, setOptionDialogOpen] = useState(false);

  const form = useForm<VariantPayload>({
    resolver: zodResolver(VariantSchema),
    defaultValues: values
      ? values
      : { optionPrompt: "", allowMultiple: false, options: [] },
  });

  useEffect(() => {
    if (variantDialogOpen) {
      if (values) {
        form.reset(values); // editing -> load existing variant
      } else {
        form.reset({ optionPrompt: "", allowMultiple: false, options: [] }); // adding -> fresh form
      }
    }
  }, [variantDialogOpen, values]);

  const { setValue: setProductValue, watch: watchProduct } = productForm;
  const variants = watchProduct("variants");
  const { setValue, handleSubmit, getValues, watch } = form;

  const options = watch("options");

  const addOption = (name: string, price: number) => {
    setValue("options", [...getValues("options"), { name, price }]);
  };

  const removeOption = (name: string) => {
    setValue(
      "options",
      getValues("options").filter((op) => op.name !== name)
    );
  };

  const onError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      showErrorToast(firstError.message);
    }
  };
  const onSubmit = (data: VariantPayload) => {
    if (values) {
      // Editing mode
      const existingIndex = variants.findIndex(
        (v: any) => v.optionPrompt === values.optionPrompt
      );

      if (existingIndex !== -1) {
        const updated = [...variants];
        updated[existingIndex] = data;
        setProductValue("variants", updated);
      }
    } else {
      // Adding mode
      if (
        variants.some(
          (v: any) => v.optionPrompt.trim() === data.optionPrompt.trim()
        )
      ) {
        showErrorToast("There is a matching option prompt");
        return;
      }

      setProductValue("variants", [...variants, data]);
    }

    form.reset();
    setVariantDialogOpen(false);
  };

  return (
    <>
      {/* Parent Variant Dialog */}
      <Dialog open={variantDialogOpen} onOpenChange={setVariantDialogOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              {/* Option Prompt */}
              <FormField
                control={form.control}
                name="optionPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Option Prompt</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Choose a size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Options</span>

                  {/* Add Option Button triggers external dialog */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setOptionDialogOpen(true)}
                  >
                    + Add Option
                  </Button>
                </div>

                {/* Options Preview */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  <AnimatePresence mode="sync">
                    {options.map((option, idx) => (
                      <MotionDiv
                        key={`${option.name}-${idx}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex items-center justify-between rounded-lg border p-2"
                      >
                        <div>
                          <div className="text-sm font-semibold">
                            {option.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${option.price}
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeOption(option.name)}
                        >
                          <X />
                        </Button>
                      </MotionDiv>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Allow multiple */}
              <FormField
                control={form.control}
                name="allowMultiple"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Allow multiple options</FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save Variant
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Child Add Option Dialog (outside parent form) */}
      <Dialog open={optionDialogOpen} onOpenChange={setOptionDialogOpen}>
        <DialogContent>
          <DialogTitle>Add Option</DialogTitle>
          <AddVariantOptionForm
            addOption={addOption}
            options={getValues("options")}
            closeDialog={() => setOptionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
