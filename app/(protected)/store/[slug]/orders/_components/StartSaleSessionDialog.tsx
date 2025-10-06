import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Store } from "lucide-react";
import React from "react";

const StartSaleSessionDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Store /> Start new session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default StartSaleSessionDialog;
