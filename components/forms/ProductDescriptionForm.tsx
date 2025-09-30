import React from "react";
import { FormField, FormLabel, FormControl, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";

const ProductDescriptionForm = ({ form }: { form: any }) => {
  return (
    <>
      <FormField
        control={form.control}
        name={"description"}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Product Description</FormLabel>
            <FormControl>
              <Textarea {...field} className="h-full min-h-[200px]" />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default ProductDescriptionForm;
