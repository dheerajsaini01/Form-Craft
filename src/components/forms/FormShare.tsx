
import React, { useState } from 'react';
import { useFormBuilder } from '@/contexts/FormBuilderContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormShareProps {
  formId: string;
}

export function FormShare({ formId }: FormShareProps) {
  const { forms, toggleFormSharing, getShareableLink } = useFormBuilder();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const form = forms.find((f) => f.id === formId);
  
  if (!form) return null;
  
  const shareUrl = form.isPublic ? getShareableLink(formId) : '';
  
  const handleToggleSharing = (checked: boolean) => {
    toggleFormSharing(formId, checked);
    
    if (checked) {
      toast({
        title: "Form sharing enabled",
        description: "Anyone with the link can now view and submit this form.",
      });
    } else {
      toast({
        title: "Form sharing disabled",
        description: "This form is now private.",
      });
    }
  };
  
  const copyToClipboard = () => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "The shareable link has been copied to your clipboard.",
        });
        
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Please try again or copy the link manually.",
        });
      });
  };
  
  return (
    <div className="rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Share2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Share Form</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="sharing-toggle" className="text-sm">
            {form.isPublic ? 'Public' : 'Private'}
          </Label>
          <Switch
            id="sharing-toggle"
            checked={form.isPublic}
            onCheckedChange={handleToggleSharing}
          />
        </div>
      </div>
      
      {form.isPublic && (
        <div className="flex space-x-2">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      )}
      
      {!form.isPublic && (
        <p className="text-sm text-muted-foreground">
          Enable sharing to generate a link that can be shared with others.
        </p>
      )}
    </div>
  );
}
