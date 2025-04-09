
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormResponse } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';

interface FormResponseContextType {
  responses: FormResponse[];
  addResponse: (formId: string, data: Record<string, any>) => void;
  getResponsesByFormId: (formId: string) => FormResponse[];
  deleteResponse: (responseId: string) => void;
  deleteAllResponsesByFormId: (formId: string) => void;
}

const FormResponseContext = createContext<FormResponseContextType | undefined>(undefined);

export const FormResponseProvider = ({ children }: { children: ReactNode }) => {
  const [responses, setResponses] = useState<FormResponse[]>(() => {
    const savedResponses = localStorage.getItem('dynoformcraft_responses');
    return savedResponses ? JSON.parse(savedResponses) : [];
  });

  // Save responses to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('dynoformcraft_responses', JSON.stringify(responses));
  }, [responses]);

  const addResponse = (formId: string, data: Record<string, any>) => {
    const newResponse: FormResponse = {
      id: uuidv4(),
      formId,
      submittedAt: Date.now(),
      data,
    };
    
    setResponses((prev) => [...prev, newResponse]);
  };

  const getResponsesByFormId = (formId: string) => {
    return responses.filter((response) => response.formId === formId);
  };

  const deleteResponse = (responseId: string) => {
    setResponses((prev) => prev.filter((response) => response.id !== responseId));
  };

  const deleteAllResponsesByFormId = (formId: string) => {
    setResponses((prev) => prev.filter((response) => response.formId !== formId));
  };

  return (
    <FormResponseContext.Provider
      value={{
        responses,
        addResponse,
        getResponsesByFormId,
        deleteResponse,
        deleteAllResponsesByFormId,
      }}
    >
      {children}
    </FormResponseContext.Provider>
  );
};

export const useFormResponse = () => {
  const context = useContext(FormResponseContext);
  if (context === undefined) {
    throw new Error('useFormResponse must be used within a FormResponseProvider');
  }
  return context;
};
