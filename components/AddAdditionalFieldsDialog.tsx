//@ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

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
      required: true,
      maxSelections: 1,
    },
  });

  const { control, handleSubmit, watch, setValue, reset } = form;
  const type = watch("type");
  const options = watch("options");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    if (isDialogOpen) {
      reset(
        values ?? {
          prompt: "",
          type: "text",
          options: [],
          required: true,
          maxSelections: 1,
        }
      );
    }
  }, [isDialogOpen, values, reset]);

  const onSubmit = (data: CreateAdditionalFieldsPayload) => {
    const formattedData =
      data.type === "text" ? { ...data, options: [] } : data;

    updateFields(formattedData);
    reset();
    setIsDialogOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogTitle className="text-lg font-semibold">
          {values ? "Edit Additional Field" : "Add Additional Field"}
        </DialogTitle>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 mt-4 text-sm"
          >
            {/* PROMPT */}
            <FormField
              control={control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter question or label..."
                      className="rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TYPE */}
            <FormField
              control={control}
              name="type"
              render={() => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    value={type}
                    onValueChange={(value) =>
                      setValue("type", value as "text" | "options")
                    }
                  >
                    <SelectTrigger className="rounded-lg">
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

            {/* OPTIONS (only if type === options) */}
            {type === "options" && (
              <div className="space-y-4 border rounded-xl p-4 bg-muted/20">
                <div className="flex justify-between items-center">
                  <FormLabel>Options</FormLabel>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => append("")}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {fields.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No options yet — add one above.
                  </p>
                )}

                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={control}
                    name={`options.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Option ${index + 1}`}
                            className="rounded-lg"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => remove(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </FormItem>
                    )}
                  />
                ))}

                {/* MAX SELECTIONS */}
                <FormField
                  control={control}
                  name="maxSelections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum selections allowed</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={options.length || 1}
                          value={field.value ?? 1}
                          onChange={(e) => {
                            const num = Math.min(
                              Math.max(1, Number(e.target.value)),
                              options.length || 1
                            );
                            field.onChange(num);
                          }}
                          className="rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* REQUIRED CHECKBOX */}
            <FormField
              control={control}
              name="required"
              render={({ field }) => (
                <div className="flex items-center gap-2 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label className="text-sm font-medium">Required</Label>
                </div>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-lg mt-2"
              variant="default"
            >
              {values ? "Update Field" : "Save Field"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdditionalFieldsDialog;
