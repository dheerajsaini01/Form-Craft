
import { useParams, Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { FormViewer } from "@/components/forms/FormViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const FormView = () => {
  const { formId } = useParams<{ formId: string }>();

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

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <FormViewer formId={formId} showShareButton={true} />
        </div>
      </main>
    </div>
  );
};

export default FormView;
