"use client";

import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface DialogButtonProps {
  buttonContent: ReactNode; // Can be a component
  children: ReactNode; // Content inside the dialog
  description?: string;
  title?: string; // Optional title for the dialog header
}

const DialogButton: React.FC<DialogButtonProps> = ({
  buttonContent,
  children,
  description,

  title,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{buttonContent}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogButton;
