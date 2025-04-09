
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useFormBuilder } from "@/contexts/FormBuilderContext";
import { useFormResponse } from "@/contexts/FormResponseContext";
import { FormData } from "@/types/form";
import { 
  Edit, 
  Copy, 
  Trash, 
  Eye, 
  MoreVertical, 
  BarChart 
} from "lucide-react";

export function FormList() {
  const { forms, deleteForm, duplicateForm } = useFormBuilder();
  const { getResponsesByFormId, deleteAllResponsesByFormId } = useFormResponse();
  const { toast } = useToast();
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteForm = () => {
    if (selectedForm) {
      deleteForm(selectedForm.id);
      deleteAllResponsesByFormId(selectedForm.id);
      toast({
        title: "Form deleted",
        description: "The form has been permanently deleted.",
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDuplicateForm = (formId: string) => {
    duplicateForm(formId);
    toast({
      title: "Form duplicated",
      description: "A copy of the form has been created.",
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (forms.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
          <div className="mb-4 rounded-full p-3 bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold">No forms yet</h3>
          <p className="mb-4 text-center text-muted-foreground">
            Create your first form to get started.
          </p>
          <Button asChild>
            <Link to="/builder">Create Form</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => {
        const responseCount = getResponsesByFormId(form.id).length;
        return (
          <Card key={form.id} className="group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="truncate">{form.title}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/builder/${form.id}`} className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/view/${form.id}`} className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDuplicateForm(form.id)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    {responseCount > 0 && (
                      <DropdownMenuItem asChild>
                        <Link to={`/responses/${form.id}`} className="flex items-center">
                          <BarChart className="mr-2 h-4 w-4" />
                          Responses
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setSelectedForm(form);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated {formatDate(form.updatedAt)}
              </p>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {form.description || `Form with ${form.fields.length} fields`}
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" asChild>
                <Link to={`/builder/${form.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button asChild>
                <Link to={`/view/${form.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the form
              and all of its responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteForm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
