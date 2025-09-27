"use client";

import { useState, useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

type ImageUploadFieldProps<T> = {
  name: keyof T;
  label?: string;
  maxFiles?: number;
  form: { control: Control<T> };
  onError?: (msg: string) => void;
};

const containerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function ImageUploadFormField<T>({
  name,
  label,
  maxFiles = 5,
  form,
  onError,
}: ImageUploadFieldProps<T>) {
  const {
    field: { value, onChange },
  } = useController({
    name: name as any,
    control: form.control,
    defaultValue: [],
  });

  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = (value as File[]).map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [value]);

  const handleFiles = (files: FileList) => {
    const filesArray = Array.from(files);
    if (filesArray.length + (value as File[]).length > maxFiles) {
      onError?.(`Maximum ${maxFiles} images allowed`);
      return;
    }
    onChange([...(value as File[]), ...filesArray]);
  };

  const removeFile = (index: number) => {
    const newFiles = (value as File[]).filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div>
      {label && <Label className="block mb-2">{label}</Label>}
      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <div className="flex flex-wrap gap-2 mt-2">
        <AnimatePresence>
          {previews.map((src, index) => (
            <motion.div
              key={index}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-24 h-24 border rounded overflow-hidden"
            >
              <img
                src={src}
                alt={`preview-${index}`}
                className="object-cover w-full h-full"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1 right-1"
                onClick={() => removeFile(index)}
              >
                <X size={14} />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
