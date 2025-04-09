
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Trash,
  Settings,
  GripVertical,
  X,
  Plus,
} from "lucide-react";
import { FormField, FieldOption } from "@/types/form";
import { useFormBuilder } from "@/contexts/FormBuilderContext";
import { v4 as uuidv4 } from "uuid";

interface FormFieldEditorProps {
  field: FormField;
  index: number;
}

export function FormFieldEditor({ field, index }: FormFieldEditorProps) {
  const [open, setOpen] = useState(false);
  const { updateField, removeField } = useFormBuilder();
  const [localField, setLocalField] = useState<FormField>(field);

  const handleUpdateField = () => {
    updateField(field.id, localField);
    setOpen(false);
  };

  const handleAddOption = () => {
    if (!localField.options) {
      setLocalField({
        ...localField,
        options: [{ id: uuidv4(), value: "", label: "" }],
      });
      return;
    }

    setLocalField({
      ...localField,
      options: [
        ...(localField.options || []),
        { id: uuidv4(), value: "", label: "" },
      ],
    });
  };

  const handleRemoveOption = (optionId: string) => {
    setLocalField({
      ...localField,
      options: localField.options?.filter((o) => o.id !== optionId),
    });
  };

  const handleOptionChange = (
    optionId: string,
    field: keyof FieldOption,
    value: string
  ) => {
    setLocalField({
      ...localField,
      options: localField.options?.map((o) =>
        o.id === optionId ? { ...o, [field]: value } : o
      ),
    });
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return <Input type={field.type} placeholder={field.placeholder} disabled />;
      case "textarea":
        return <Textarea placeholder={field.placeholder} disabled />;
      case "dropdown":
        return (
          <select className="w-full p-2 border rounded" disabled>
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="flex flex-col gap-2">
            {field.options?.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <input type="radio" disabled />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="flex flex-col gap-2">
            {field.options?.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <input type="checkbox" disabled />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        );
      case "date":
        return <Input type="date" disabled />;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-4 group">
      <CardHeader className="p-4 flex flex-row justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="cursor-grab h-5 w-5 text-muted-foreground drag-handle" />
          <h3 className="font-medium">{field.label}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Field</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="label">Field Label</Label>
                  <Input
                    id="label"
                    value={localField.label}
                    onChange={(e) =>
                      setLocalField({ ...localField, label: e.target.value })
                    }
                  />
                </div>
                {(field.type === "text" ||
                  field.type === "textarea" ||
                  field.type === "email" ||
                  field.type === "number" ||
                  field.type === "dropdown") && (
                  <div className="grid gap-2">
                    <Label htmlFor="placeholder">Placeholder</Label>
                    <Input
                      id="placeholder"
                      value={localField.placeholder || ""}
                      onChange={(e) =>
                        setLocalField({
                          ...localField,
                          placeholder: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={localField.description || ""}
                    onChange={(e) =>
                      setLocalField({
                        ...localField,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="required"
                    checked={localField.required}
                    onCheckedChange={(checked) =>
                      setLocalField({ ...localField, required: checked })
                    }
                  />
                  <Label htmlFor="required">Required Field</Label>
                </div>

                {(field.type === "dropdown" ||
                  field.type === "radio" ||
                  field.type === "checkbox") && (
                  <div className="grid gap-2">
                    <Label>Options</Label>
                    {localField.options?.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-2"
                      >
                        <Input
                          value={option.label}
                          onChange={(e) =>
                            handleOptionChange(
                              option.id,
                              "label",
                              e.target.value
                            )
                          }
                          placeholder="Option Label"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveOption(option.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={handleAddOption}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleUpdateField}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => removeField(field.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {field.description && (
          <p className="text-sm text-muted-foreground mb-2">{field.description}</p>
        )}
        {renderFieldPreview()}
        {field.required && (
          <p className="text-xs text-muted-foreground mt-1">Required</p>
        )}
      </CardContent>
    </Card>
  );
}
