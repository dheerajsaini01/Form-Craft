
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/types/form";
import { PlusCircle, X } from "lucide-react";

interface ConditionalLogicProps {
  fields: FormField[];
  currentFieldId: string;
  conditions: any[];
  onUpdateConditions: (conditions: any[]) => void;
}

export function ConditionalLogic({
  fields,
  currentFieldId,
  conditions = [],
  onUpdateConditions,
}: ConditionalLogicProps) {
  const [enabled, setEnabled] = useState(conditions.length > 0);

  const availableFields = fields.filter(field => field.id !== currentFieldId);

  const handleAddCondition = () => {
    const newCondition = {
      id: Math.random().toString(36).substring(2),
      fieldId: availableFields.length > 0 ? availableFields[0].id : "",
      operator: "equals",
      value: "",
    };
    
    onUpdateConditions([...conditions, newCondition]);
  };

  const handleRemoveCondition = (id: string) => {
    onUpdateConditions(conditions.filter(c => c.id !== id));
  };

  const handleUpdateCondition = (id: string, key: string, value: string) => {
    onUpdateConditions(
      conditions.map(c => (c.id === id ? { ...c, [key]: value } : c))
    );
  };

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    if (!checked) {
      onUpdateConditions([]);
    } else if (checked && conditions.length === 0) {
      handleAddCondition();
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <div className="flex items-center justify-between">
        <Label htmlFor="enable-logic" className="font-medium">
          Conditional Logic
        </Label>
        <Switch
          id="enable-logic"
          checked={enabled}
          onCheckedChange={handleToggle}
        />
      </div>

      {enabled && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Show this field only when the following conditions are met:
          </p>

          {conditions.map((condition) => (
            <div key={condition.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Select
                  value={condition.fieldId}
                  onValueChange={(value) =>
                    handleUpdateCondition(condition.id, "fieldId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3">
                <Select
                  value={condition.operator}
                  onValueChange={(value) =>
                    handleUpdateCondition(condition.id, "operator", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="notEquals">Not Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="notContains">Not Contains</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-4">
                <Input
                  value={condition.value}
                  onChange={(e) =>
                    handleUpdateCondition(condition.id, "value", e.target.value)
                  }
                  placeholder="Value"
                />
              </div>

              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCondition(condition.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCondition}
            className="mt-2"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>
      )}
    </div>
  );
}
