"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateAdditionalFieldsSchema,
  CreateAdditionalFieldsPayload,
} from "@/schemas/create-addtional-fields";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

const AddAdditionalFieldsDialog = ({
  updateFields,
  children,
  values,
}: {
  updateFields: (field: CreateAdditionalFieldsPayload) => void;
  children: React.ReactNode;
  values?: CreateAdditionalFieldsPayload;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<CreateAdditionalFieldsPayload>({
    resolver: zodResolver(CreateAdditionalFieldsSchema),
    defaultValues: {
      prompt: "",
      type: "text",
      options: [],
      allowMulitpleOptions: false,
    },
  });

  useEffect(() => {
    if (isDialogOpen) {
      if (values) {
        form.reset(values); // editing -> load existing variant
      } else {
        form.reset({
          prompt: "",
          type: "text",
          options: [],
          allowMulitpleOptions: false,
        }); // adding -> fresh form
      }
    }
  }, [isDialogOpen, values]);

  const { control, handleSubmit, watch, setValue } = form;
  const type = watch("type");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const onSubmit = (data: CreateAdditionalFieldsPayload) => {
    let formattedData;
    if (data.type === "text") {
      formattedData = {
        ...data,
        options: [],
      };
    } else {
      formattedData = data;
    }

    console.log("Form data:", formattedData);

    updateFields(formattedData);
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Additional Field</DialogTitle>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Prompt */}
            <FormField
              control={control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <Label>Prompt</Label>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={control}
              name="type"
              render={() => (
                <FormItem>
                  <Label>Type</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("type", value as "text" | "options")
                    }
                    defaultValue={type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="options">Options</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Options */}
            {type === "options" && (
              <div>
                <Label>Options</Label>
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={control}
                    name={`options.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 mt-2">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => remove(index)}
                        >
                          <X />
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append("")}
                  className="mt-2"
                >
                  Add Option
                </Button>

                {/* Allow Multiple Options */}
                <FormField
                  control={control}
                  name="allowMulitpleOptions"
                  render={({ field }) => (
                    <div className="flex items-center mt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label className="ml-2">Allow Multiple Options</Label>
                    </div>
                  )}
                />
              </div>
            )}

            <Button type="submit" className="mt-4 w-full">
              Save Field
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdditionalFieldsDialog;
