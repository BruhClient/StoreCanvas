"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useUploadThing } from "@/lib/uploadthing";

export function useFileUploader() {
  /**
   * Returns a function that uploads files to a specified endpoint
   */
  const upload = async (
    endpoint: keyof OurFileRouter,
    files: File | File[]
  ): Promise<string[]> => {
    const { startUpload } = useUploadThing(endpoint);
    const filesArray = Array.isArray(files) ? files : [files];

    try {
      const uploadedFiles = await startUpload(filesArray);
      return uploadedFiles!.map((f) => f.ufsUrl);
    } catch (err: any) {
      console.error("Upload failed:", err);
      throw err;
    }
  };

  return upload;
}
