
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
}: SuccessDialogProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    onOpenChange(false);
    navigate("/");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose}>Return to Dashboard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
