
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormData, FormField, FormStyle } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';

interface FormBuilderContextType {
  forms: FormData[];
  currentForm: FormData | null;
  createNewForm: () => void;
  createFormFromTemplate: (templateData: Partial<FormData>) => string;
  updateForm: (form: FormData) => void;
  deleteForm: (formId: string) => void;
  duplicateForm: (formId: string) => void;
  loadForm: (formId: string) => void;
  addField: (field: Omit<FormField, 'id'>) => void;
  updateField: (fieldId: string, field: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  moveField: (oldIndex: number, newIndex: number) => void;
  updateFormStyle: (style: Partial<FormStyle>) => void;
  updateFormDetails: (details: { title?: string; description?: string }) => void;
  toggleFormSharing: (formId: string, isPublic: boolean) => void;
  getShareableLink: (formId: string) => string;
}

const defaultStyle: FormStyle = {
  primaryColor: '#8B5CF6', // Purple
  backgroundColor: '#FFFFFF',
  fontFamily: 'Inter, sans-serif',
  borderRadius: 8,
};

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

export const FormBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [forms, setForms] = useState<FormData[]>(() => {
    const savedForms = localStorage.getItem('dynoformcraft_forms');
    return savedForms ? JSON.parse(savedForms) : [];
  });
  
  const [currentForm, setCurrentForm] = useState<FormData | null>(null);
  
  // Save forms to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('dynoformcraft_forms', JSON.stringify(forms));
  }, [forms]);

  const createNewForm = () => {
    const newForm: FormData = {
      id: uuidv4(),
      title: 'Untitled Form',
      description: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fields: [],
      style: defaultStyle,
      isPublic: false,
    };
    
    setForms((prev) => [...prev, newForm]);
    setCurrentForm(newForm);
    return newForm.id;
  };

  const createFormFromTemplate = (templateData: Partial<FormData>) => {
    const newForm: FormData = {
      id: uuidv4(),
      title: templateData.title || 'Untitled Form',
      description: templateData.description || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fields: templateData.fields || [],
      style: templateData.style || defaultStyle,
      isPublic: false,
    };
    
    setForms((prev) => [...prev, newForm]);
    setCurrentForm(newForm);
    return newForm.id;
  };

  const updateForm = (form: FormData) => {
    setForms((prev) => prev.map((f) => (f.id === form.id ? { ...form, updatedAt: Date.now() } : f)));
    
    if (currentForm && currentForm.id === form.id) {
      setCurrentForm({ ...form, updatedAt: Date.now() });
    }
  };

  const deleteForm = (formId: string) => {
    setForms((prev) => prev.filter((form) => form.id !== formId));
    
    if (currentForm && currentForm.id === formId) {
      setCurrentForm(null);
    }
  };

  const duplicateForm = (formId: string) => {
    const formToDuplicate = forms.find((form) => form.id === formId);
    
    if (!formToDuplicate) return;
    
    const duplicatedForm: FormData = {
      ...formToDuplicate,
      id: uuidv4(),
      title: `${formToDuplicate.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPublic: false, // Reset public status for the duplicate
      shareUrl: undefined, // Reset the share URL
    };
    
    setForms((prev) => [...prev, duplicatedForm]);
  };

  const loadForm = (formId: string) => {
    const form = forms.find((form) => form.id === formId);
    setCurrentForm(form || null);
  };

  const addField = (field: Omit<FormField, 'id'>) => {
    if (!currentForm) return;
    
    const newField: FormField = {
      id: uuidv4(),
      ...field,
    };
    
    const updatedForm = {
      ...currentForm,
      fields: [...currentForm.fields, newField],
      updatedAt: Date.now(),
    };
    
    setCurrentForm(updatedForm);
    updateForm(updatedForm);
  };

  const updateField = (fieldId: string, field: Partial<FormField>) => {
    if (!currentForm) return;
    
    const updatedFields = currentForm.fields.map((f) =>
      f.id === fieldId ? { ...f, ...field } : f
    );
    
    const updatedForm = {
      ...currentForm,
      fields: updatedFields,
      updatedAt: Date.now(),
    };
    
    setCurrentForm(updatedForm);
    updateForm(updatedForm);
  };

  const removeField = (fieldId: string) => {
    if (!currentForm) return;
    
    const updatedFields = currentForm.fields.filter((f) => f.id !== fieldId);
    
    const updatedForm = {
      ...currentForm,
      fields: updatedFields,
      updatedAt: Date.now(),
    };
    
    setCurrentForm(updatedForm);
    updateForm(updatedForm);
  };

  const moveField = (oldIndex: number, newIndex: number) => {
    if (!currentForm) return;
    
    const fields = [...currentForm.fields];
    const [removed] = fields.splice(oldIndex, 1);
    fields.splice(newIndex, 0, removed);
    
    const updatedForm = {
      ...currentForm,
      fields,
      updatedAt: Date.now(),
    };
    
    setCurrentForm(updatedForm);
    updateForm(updatedForm);
  };

  const updateFormStyle = (style: Partial<FormStyle>) => {
    if (!currentForm) return;
    
    const updatedForm = {
      ...currentForm,
      style: { ...currentForm.style, ...style },
      updatedAt: Date.now(),
    };
    
    setCurrentForm(updatedForm);
    updateForm(updatedForm);
  };

  const updateFormDetails = (details: { title?: string; description?: string }) => {
    if (!currentForm) return;
    
    const updatedForm = {
      ...currentForm,
      ...details,
      updatedAt: Date.now(),
    };
    
    setCurrentForm(updatedForm);
    updateForm(updatedForm);
  };

  // New sharing functionality
  const toggleFormSharing = (formId: string, isPublic: boolean) => {
    const formToUpdate = forms.find(form => form.id === formId);
    if (!formToUpdate) return;

    const updatedForm = {
      ...formToUpdate,
      isPublic,
      shareUrl: isPublic ? getShareableLink(formId) : undefined,
      updatedAt: Date.now(),
    };

    setForms(prev => prev.map(form => 
      form.id === formId ? updatedForm : form
    ));

    if (currentForm && currentForm.id === formId) {
      setCurrentForm(updatedForm);
    }
  };

  const getShareableLink = (formId: string) => {
    // Generate the full URL to the form view
    const baseUrl = window.location.origin;
    return `${baseUrl}/view/${formId}`;
  };

  return (
    <FormBuilderContext.Provider
      value={{
        forms,
        currentForm,
        createNewForm,
        createFormFromTemplate,
        updateForm,
        deleteForm,
        duplicateForm,
        loadForm,
        addField,
        updateField,
        removeField,
        moveField,
        updateFormStyle,
        updateFormDetails,
        toggleFormSharing,
        getShareableLink,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
};
