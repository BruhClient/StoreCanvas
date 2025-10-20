import FlexImage from "@/components/FlexImage";
import { Button } from "@/components/ui/button";
import { stores } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function StoreAdditionalFields({
  store,
  onSubmit,
  initialValues,
}: {
  store: InferSelectModel<typeof stores>;
  onSubmit: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}) {
  const [values, setValues] = useState<Record<string, any>>(
    initialValues ?? {}
  );

  const handleChange = (prompt: string, value: any) => {
    setValues((prev) => ({ ...prev, [prompt]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Store Header */}
      <div className="flex gap-3 items-center">
        <FlexImage
          src={store.imageUrl || "/placeholder-image.png"}
          alt={store.name}
          width={42}
          height={42}
          aspectRatio="1/1"
          rounded="2xl"
        />
        <div>
          <div className="text-sm font-semibold">{store.name}</div>
          <div className="text-muted-foreground text-xs">
            Prices set in {store.currency}
          </div>
        </div>
      </div>

      {/* Additional Fields */}
      <div className="space-y-6">
        {store.additionalFields?.map((field: any, i: number) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <label className="block text-sm font-medium mb-2">
              {field.prompt}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "text" ? (
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder={`Enter ${field.prompt.toLowerCase()}`}
                required={field.required}
                value={values[field.prompt] ?? ""}
                onChange={(e) => handleChange(field.prompt, e.target.value)}
              />
            ) : (
              <div className="space-y-2">
                {/* Show max selections info */}
                {field.maxSelections && (
                  <p className="text-xs text-muted-foreground mb-1">
                    Select up to {field.maxSelections} option
                    {field.maxSelections > 1 ? "s" : ""}
                  </p>
                )}

                {field.options?.map((opt: string, j: number) => {
                  const selected = values[field.prompt] || [];
                  const checked = selected.includes(opt);
                  const maxReached =
                    field.maxSelections &&
                    selected.length >= field.maxSelections;

                  return (
                    <label
                      key={j}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border ${
                        checked
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      } transition`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!checked && maxReached}
                        className="h-4 w-4 accent-indigo-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleChange(field.prompt, [...selected, opt]);
                          } else {
                            handleChange(
                              field.prompt,
                              selected.filter((o: string) => o !== opt)
                            );
                          }
                        }}
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <Button onClick={() => onSubmit(values)} className="w-full">
        Continue to Checkout <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
