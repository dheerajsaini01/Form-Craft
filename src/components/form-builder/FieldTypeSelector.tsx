
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { FieldType } from "@/types/form";
import { useFormBuilder } from "@/contexts/FormBuilderContext";

interface FieldTypesProps {
  onClose: () => void;
}

const fieldTypes: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  {
    type: "text",
    label: "Text",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V4h16v3" />
        <path d="M9 20h6" />
        <path d="M12 4v16" />
      </svg>
    ),
  },
  {
    type: "textarea",
    label: "Paragraph",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V4h16v3" />
        <path d="M4 11h16" />
        <path d="M4 15h16" />
        <path d="M4 19h16" />
      </svg>
    ),
  },
  {
    type: "number",
    label: "Number",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 8a4 4 0 1 1-3.995 4.2L4 12l.005-.2A4 4 0 0 1 8 8z" />
        <path d="M16 8a4 4 0 1 1-3.995 4.2L12 12l.005-.2A4 4 0 0 1 16 8z" />
      </svg>
    ),
  },
  {
    type: "email",
    label: "Email",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    ),
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    type: "radio",
    label: "Radio",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    type: "date",
    label: "Date",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
      </svg>
    ),
  },
];

const FieldTypes = ({ onClose }: FieldTypesProps) => {
  const { addField } = useFormBuilder();

  const handleAddField = (type: FieldType) => {
    addField({
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1) + " Field",
      required: false,
      placeholder: type === "dropdown" ? "Select an option" : `Enter ${type}...`,
      options: type === "dropdown" || type === "radio" || type === "checkbox" ? [
        { id: "option1", value: "option1", label: "Option 1" },
        { id: "option2", value: "option2", label: "Option 2" },
      ] : undefined,
    });
    onClose();
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
      {fieldTypes.map((fieldType) => (
        <Card
          key={fieldType.type}
          className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => handleAddField(fieldType.type)}
        >
          <div className="h-12 w-12 flex items-center justify-center text-primary mb-2">
            {fieldType.icon}
          </div>
          <span className="text-sm font-medium">{fieldType.label}</span>
        </Card>
      ))}
    </div>
  );
};

export function FieldTypeSelector() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-dashed">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose a field type</DialogTitle>
        </DialogHeader>
        <FieldTypes onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
