
import { useParams, Link } from "react-router-dom";
import { useFormBuilder } from "@/contexts/FormBuilderContext";
import { useFormResponse } from "@/contexts/FormResponseContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { FormResponseDisplay } from "@/components/forms/FormResponseDisplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const FormResponses = () => {
  const { formId } = useParams<{ formId: string }>();
  const { forms } = useFormBuilder();
  const { getResponsesByFormId } = useFormResponse();

  if (!formId) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Form Not Found</h1>
            <p className="text-muted-foreground mb-6">
              No form ID was provided in the URL.
            </p>
            <Button asChild>
              <Link to="/">Return to Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const form = forms.find((f) => f.id === formId);
  const responses = getResponsesByFormId(formId);

  if (!form) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Form Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The form you're looking for doesn't exist or has been deleted.
            </p>
            <Button asChild>
              <Link to="/">Return to Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Button variant="outline" asChild className="mb-2">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">{form.title} - Responses</h1>
              <p className="text-muted-foreground">
                View and manage form submissions
              </p>
            </div>
            <Button asChild>
              <Link to={`/view/${formId}`}>View Form</Link>
            </Button>
          </div>

          <FormResponseDisplay form={form} responses={responses} />
        </div>
      </main>
    </div>
  );
};

export default FormResponses;
