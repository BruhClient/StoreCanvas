import React from "react";
import { FormField, FormLabel, FormControl, FormItem } from "../ui/form";
import ImageUploadFormField from "../ImageUploadFormInput";
import { showErrorToast } from "@/lib/toast";
import { Input } from "../ui/input";

const ProductInformationForm = ({ form }: { form: any }) => {
  return (
    <>
      <FormField
        control={form.control}
        name={"name"}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <div className="flex items-center rounded-md border px-3">
                <span className="text-muted-foreground mr-2">$</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    // Format to 2dp on blur
                    const value = e.target.value;
                    if (value) {
                      e.target.value = parseFloat(value).toFixed(2);
                      field.onChange(e); // update react-hook-form with formatted value
                    }
                  }}
                  value={field.value}
                  onChange={field.onChange}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <ImageUploadFormField
        name="images"
        label="Upload Product Images"
        maxFiles={5}
        form={form}
        onError={(msg) => showErrorToast(msg)}
      />
    </>
  );
};

export default ProductInformationForm;
