
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormBuilder } from "@/contexts/FormBuilderContext";
import { useFormResponse } from "@/contexts/FormResponseContext";
import { FormField } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { recordFormView, recordFormSubmission } from "@/utils/form-analytics";
import { FormShare } from "./FormShare";

interface FormViewerProps {
  formId: string;
  showShareButton?: boolean;
}

export function FormViewer({ formId, showShareButton = false }: FormViewerProps) {
  const { forms } = useFormBuilder();
  const { addResponse } = useFormResponse();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = forms.find((f) => f.id === formId);
  
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Record form view
  useEffect(() => {
    if (form) {
      recordFormView(formId);
    }
  }, [formId, form]);

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold mb-2">Form Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The form you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    form.fields.forEach((field) => {
      if (field.required) {
        const value = formValues[field.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = "This field is required";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Add the response
      addResponse(form.id, formValues);
      
      // Record submission in analytics
      recordFormSubmission(form.id);
      
      // Show success dialog
      setShowSuccessDialog(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "There was a problem submitting your form. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    
    // Clear error if field is filled
    if (errors[fieldId] && value) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setFormValues({});
    navigate("/");
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={errors[field.id] ? "border-destructive" : ""}
            style={{ borderRadius: `${form.style.borderRadius}px` }}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={errors[field.id] ? "border-destructive" : ""}
            style={{ borderRadius: `${form.style.borderRadius}px` }}
          />
        );
      case "dropdown":
        return (
          <select
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full h-10 px-3 py-2 border bg-background rounded-md ${
              errors[field.id] ? "border-destructive" : "border-input"
            }`}
            style={{ borderRadius: `${form.style.borderRadius}px` }}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option.id}`}
                  checked={
                    Array.isArray(formValues[field.id]) &&
                    formValues[field.id]?.includes(option.value)
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const currentValues = Array.isArray(formValues[field.id])
                        ? [...formValues[field.id]]
                        : [];
                      handleInputChange(field.id, [...currentValues, option.value]);
                    } else {
                      const currentValues = Array.isArray(formValues[field.id])
                        ? [...formValues[field.id]]
                        : [];
                      handleInputChange(
                        field.id,
                        currentValues.filter((v) => v !== option.value)
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`${field.id}-${option.id}`}
                  className="text-sm font-normal"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <RadioGroup
            value={formValues[field.id] || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            {field.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.id}-${option.id}`}
                />
                <Label
                  htmlFor={`${field.id}-${option.id}`}
                  className="text-sm font-normal"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "date":
        return (
          <Input
            type="date"
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={errors[field.id] ? "border-destructive" : ""}
            style={{ borderRadius: `${form.style.borderRadius}px` }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        {showShareButton && (
          <div className="mb-6">
            <FormShare formId={formId} />
          </div>
        )}
        
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: form.style.backgroundColor,
            fontFamily: form.style.fontFamily,
          }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: form.style.primaryColor }}
          >
            {form.title}
          </h2>
          {form.description && (
            <p className="mb-6 text-gray-600">{form.description}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center gap-1">
                  <label className="font-medium">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                </div>
                {field.description && (
                  <p className="text-sm text-gray-500 mb-1">{field.description}</p>
                )}
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-sm text-destructive mt-1">{errors[field.id]}</p>
                )}
              </div>
            ))}
            {form.fields.length > 0 && (
              <Button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: form.style.primaryColor,
                  borderRadius: `${form.style.borderRadius}px`,
                }}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="Form Submitted Successfully!"
        description={`Thank you for submitting your response to ${form.title}. Your information has been recorded.`}
      />
    </>
  );
}
