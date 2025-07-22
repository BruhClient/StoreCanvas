import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { CircleAlert } from "lucide-react";
import { MotionDiv } from "./Motion";
import { containerVariants } from "@/lib/variants";
import { capitalizeFirstLetter } from "@/lib/utils";

const FormTextInput = ({
  form,
  fieldName,
  placeholder,
  label,
  disabled = false,
  type = "text",
}: {
  form: any;
  type?: HTMLInputElement["type"];
  fieldName: string;
  placeholder: string;
  label?: string;
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="text-muted-foreground">
            {label ? label : capitalizeFirstLetter(fieldName)}
          </FormLabel>
          <div className="relative flex items-center">
            <FormControl>
              <Input
                {...field}
                className="py-5 placeholder:font-semibold px-4"
                placeholder={placeholder}
                type={type}
                disabled={disabled}
              />
            </FormControl>

            {form.formState.errors[fieldName] && (
              <CircleAlert
                className="absolute right-3 stroke-destructive"
                size={20}
              />
            )}
          </div>

          {form.formState.errors[fieldName] && (
            <MotionDiv
              className="text-sm text-destructive font-serif"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {form.formState.errors[fieldName].message}
            </MotionDiv>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormTextInput;
