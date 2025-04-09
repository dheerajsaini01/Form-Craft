import { useState, useEffect } from "react";
import { useFormBuilder } from "@/contexts/FormBuilderContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FormFieldEditor } from "./FormFieldEditor";
import { FieldTypeSelector } from "./FieldTypeSelector";
import { FormStyleEditor } from "./FormStyleEditor";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableFormField({ field, index }: { field: any; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <FormFieldEditor field={field} index={index} />
    </div>
  );
}

export function FormBuilderLayout() {
  const { currentForm, updateFormDetails, moveField } = useFormBuilder();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  
  // Update local state when currentForm changes
  useEffect(() => {
    if (currentForm) {
      setTitle(currentForm.title || "");
      setDescription(currentForm.description || "");
    }
  }, [currentForm]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  
  const handleBlur = () => {
    if (currentForm) {
      updateFormDetails({ title, description });
      toast({
        title: "Form details updated",
        description: "Your form details have been saved.",
      });
    }
  };
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );
  
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = currentForm?.fields.findIndex((field) => field.id === active.id);
      const newIndex = currentForm?.fields.findIndex((field) => field.id === over.id);
      
      if (oldIndex !== undefined && newIndex !== undefined) {
        moveField(oldIndex, newIndex);
      }
    }
  };
  
  if (!currentForm) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No form selected.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="fields" className="w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4 space-y-6">
            <div className="space-y-4">
              <Input
                value={title}
                onChange={handleTitleChange}
                onBlur={handleBlur}
                placeholder="Form Title"
                className="text-2xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Textarea
                value={description}
                onChange={handleDescriptionChange}
                onBlur={handleBlur}
                placeholder="Form Description (optional)"
                className="resize-none border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            
            <TabsList className="mb-4">
              <TabsTrigger value="fields">Fields</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="fields">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={currentForm.fields.map((field) => field.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {currentForm.fields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-6 space-y-2 text-center">
                          <p className="text-muted-foreground">Start by adding fields to your form.</p>
                        </div>
                      ) : (
                        currentForm.fields.map((field, index) => (
                          <SortableFormField key={field.id} field={field} index={index} />
                        ))
                      )}
                    </SortableContext>
                  </DndContext>
                  <FieldTypeSelector />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preview">
              <Card>
                <CardContent className="p-6">
                  <div 
                    className="p-6 rounded-lg"
                    style={{
                      backgroundColor: currentForm.style.backgroundColor,
                      fontFamily: currentForm.style.fontFamily,
                    }}
                  >
                    <h2 
                      className="text-2xl font-bold mb-4"
                      style={{ color: currentForm.style.primaryColor }}
                    >
                      {currentForm.title}
                    </h2>
                    {currentForm.description && (
                      <p className="mb-6 text-gray-600">{currentForm.description}</p>
                    )}
                    <div className="space-y-6">
                      {currentForm.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <div className="flex items-center gap-1">
                            <label className="font-medium">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                          </div>
                          {field.description && (
                            <p className="text-sm text-gray-500">{field.description}</p>
                          )}
                          {field.type === 'text' && (
                            <Input placeholder={field.placeholder} />
                          )}
                          {field.type === 'textarea' && (
                            <Textarea placeholder={field.placeholder} />
                          )}
                          {field.type === 'email' && (
                            <Input type="email" placeholder={field.placeholder} />
                          )}
                          {field.type === 'number' && (
                            <Input type="number" placeholder={field.placeholder} />
                          )}
                          {field.type === 'date' && (
                            <Input type="date" />
                          )}
                          {field.type === 'dropdown' && (
                            <select 
                              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                              style={{ borderRadius: `${currentForm.style.borderRadius}px` }}
                            >
                              <option value="">{field.placeholder}</option>
                              {field.options?.map((option) => (
                                <option key={option.id} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                          {field.type === 'checkbox' && (
                            <div className="space-y-2">
                              {field.options?.map((option) => (
                                <div key={option.id} className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" 
                                    id={option.id} 
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                  <label htmlFor={option.id}>{option.label}</label>
                                </div>
                              ))}
                            </div>
                          )}
                          {field.type === 'radio' && (
                            <div className="space-y-2">
                              {field.options?.map((option) => (
                                <div key={option.id} className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    id={option.id} 
                                    name={field.id} 
                                    className="h-4 w-4 rounded-full border-gray-300"
                                  />
                                  <label htmlFor={option.id}>{option.label}</label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {currentForm.fields.length > 0 && (
                        <Button 
                          className="mt-4"
                          style={{ 
                            backgroundColor: currentForm.style.primaryColor,
                            borderRadius: `${currentForm.style.borderRadius}px` 
                          }}
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
          <div className="w-full md:w-1/4">
            <FormStyleEditor />
          </div>
        </div>
      </Tabs>
    </div>
  );
}
