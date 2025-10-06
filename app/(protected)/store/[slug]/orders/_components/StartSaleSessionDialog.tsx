"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DoorOpen, Plus } from "lucide-react";
import React from "react";
import StartSaleSessionForm from "./StartSaleSessionForm";

const StartSaleSessionButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <DoorOpen />
          Open Store
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Sale Session</DialogTitle>
          <DialogDescription>
            This will open a sale session for your store. Customers will be able
            to pay using the available payment options.
          </DialogDescription>
        </DialogHeader>
        <StartSaleSessionForm />
      </DialogContent>
    </Dialog>
  );
};

export default StartSaleSessionButton;
