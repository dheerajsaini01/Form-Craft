
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { FormBuilderLayout } from "@/components/form-builder/FormBuilderLayout";
import { useFormBuilder } from "@/contexts/FormBuilderContext";

const FormBuilder = () => {
  const { formId } = useParams<{ formId?: string }>();
  const { forms, loadForm, createNewForm } = useFormBuilder();
  const navigate = useNavigate();

  useEffect(() => {
    if (formId) {
      const formExists = forms.some((form) => form.id === formId);
      
      if (formExists) {
        loadForm(formId);
      } else {
        navigate("/builder");
      }
    } else if (forms.length > 0) {
      // If no formId is provided but there are forms, load the most recent one
      const mostRecentForm = [...forms].sort((a, b) => b.updatedAt - a.updatedAt)[0];
      navigate(`/builder/${mostRecentForm.id}`);
    } else {
      // If no forms exist, create a new one
      createNewForm();
    }
  }, [formId, forms, loadForm, navigate, createNewForm]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <FormBuilderLayout />
      </main>
    </div>
  );
};

export default FormBuilder;
