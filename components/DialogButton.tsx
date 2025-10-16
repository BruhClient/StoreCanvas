"use client";

import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
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
  dialogOpen?: boolean;
  setDialogOpen?: Dispatch<SetStateAction<boolean>>;
  onDialogOpen?: () => void; // Callback when dialog opens
}

const DialogButton: React.FC<DialogButtonProps> = ({
  buttonContent,
  children,
  description,
  dialogOpen,
  setDialogOpen,
  title,
  onDialogOpen,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (value: boolean) => {
    // Update internal or external state
    if (setDialogOpen) {
      setDialogOpen(value);
    } else {
      setOpen(value);
    }

    // Call callback if dialog is opening
    if (value && onDialogOpen) {
      onDialogOpen();
    }
  };

  return (
    <Dialog open={dialogOpen ?? open} onOpenChange={handleOpenChange}>
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
