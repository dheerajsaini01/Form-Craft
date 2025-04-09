
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormShare } from './FormShare';

interface ShareModalProps {
  formId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ formId, isOpen, onClose }: ShareModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Form</DialogTitle>
          <DialogDescription>
            Allow others to view and submit your form by enabling sharing and sending them the link.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FormShare formId={formId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
