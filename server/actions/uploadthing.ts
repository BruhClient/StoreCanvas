"use server";

import { UTApi } from "uploadthing/server";
export const deleteFileFromUploadthing = async (key: string) => {
  console.log("DELETED KEY", key);
  try {
    const utapi = new UTApi();
    await utapi.deleteFiles([key]);
  } catch (error) {
    console.log(error);
    return null;
  }
};
