
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useFormBuilder } from "@/contexts/FormBuilderContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FormStyle, FormData, FieldType } from "@/types/form";

const defaultStyle: FormStyle = {
  primaryColor: "#8B5CF6",
  backgroundColor: "#FFFFFF",
  fontFamily: "Inter, sans-serif",
  borderRadius: 8,
};

const formTemplates = [
  {
    id: "contact",
    title: "Contact Form",
    description: "A simple contact form with name, email, and message fields",
    fields: [
      {
        id: uuidv4(),
        type: "text" as FieldType,
        label: "Name",
        placeholder: "Your name",
        required: true,
      },
      {
        id: uuidv4(),
        type: "email" as FieldType,
        label: "Email",
        placeholder: "Your email address",
        required: true,
      },
      {
        id: uuidv4(),
        type: "textarea" as FieldType,
        label: "Message",
        placeholder: "Your message",
        required: true,
      },
    ],
  },
  {
    id: "survey",
    title: "Feedback Survey",
    description: "A customer satisfaction survey with multiple choice questions",
    fields: [
      {
        id: uuidv4(),
        type: "text" as FieldType,
        label: "Name",
        placeholder: "Your name",
        required: false,
      },
      {
        id: uuidv4(),
        type: "email" as FieldType,
        label: "Email",
        placeholder: "Your email address",
        required: false,
      },
      {
        id: uuidv4(),
        type: "radio" as FieldType,
        label: "How satisfied are you with our service?",
        required: true,
        options: [
          { id: uuidv4(), value: "very_satisfied", label: "Very satisfied" },
          { id: uuidv4(), value: "satisfied", label: "Satisfied" },
          { id: uuidv4(), value: "neutral", label: "Neutral" },
          { id: uuidv4(), value: "dissatisfied", label: "Dissatisfied" },
          { id: uuidv4(), value: "very_dissatisfied", label: "Very dissatisfied" },
        ],
      },
      {
        id: uuidv4(),
        type: "textarea" as FieldType,
        label: "Additional Comments",
        placeholder: "Please share any additional feedback",
        required: false,
      },
    ],
  },
  {
    id: "event",
    title: "Event Registration",
    description: "A form for event registration with personal details and preferences",
    fields: [
      {
        id: uuidv4(),
        type: "text" as FieldType,
        label: "Full Name",
        placeholder: "Your full name",
        required: true,
      },
      {
        id: uuidv4(),
        type: "email" as FieldType,
        label: "Email",
        placeholder: "Your email address",
        required: true,
      },
      {
        id: uuidv4(),
        type: "dropdown" as FieldType,
        label: "How did you hear about this event?",
        placeholder: "Select an option",
        required: true,
        options: [
          { id: uuidv4(), value: "social_media", label: "Social Media" },
          { id: uuidv4(), value: "email", label: "Email" },
          { id: uuidv4(), value: "friend", label: "Friend or Colleague" },
          { id: uuidv4(), value: "website", label: "Website" },
          { id: uuidv4(), value: "other", label: "Other" },
        ],
      },
      {
        id: uuidv4(),
        type: "checkbox" as FieldType,
        label: "Which sessions are you interested in attending?",
        required: true,
        options: [
          { id: uuidv4(), value: "keynote", label: "Keynote Presentation" },
          { id: uuidv4(), value: "workshop", label: "Workshop Sessions" },
          { id: uuidv4(), value: "networking", label: "Networking Event" },
          { id: uuidv4(), value: "panel", label: "Panel Discussion" },
        ],
      },
    ],
  },
];

export function FormTemplates() {
  const { createFormFromTemplate } = useFormBuilder();
  const navigate = useNavigate();

  const handleSelectTemplate = (templateId: string) => {
    const template = formTemplates.find((t) => t.id === templateId);
    if (!template) return;

    const newForm: Partial<FormData> = {
      title: template.title,
      description: template.description,
      fields: template.fields,
      style: { ...defaultStyle },
    };

    const formId = createFormFromTemplate(newForm);
    navigate(`/builder/${formId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {formTemplates.map((template) => (
        <Card key={template.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{template.title}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {template.fields.length} fields included
            </p>
            <Button 
              onClick={() => handleSelectTemplate(template.id)}
              className="w-full"
            >
              Use Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
