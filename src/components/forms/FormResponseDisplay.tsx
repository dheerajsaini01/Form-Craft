
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormData, FormResponse } from "@/types/form";
import { DownloadIcon, Trash } from "lucide-react";
import { useFormResponse } from "@/contexts/FormResponseContext";
import { useToast } from "@/hooks/use-toast";

interface FormResponseDisplayProps {
  form: FormData;
  responses: FormResponse[];
}

export function FormResponseDisplay({ form, responses }: FormResponseDisplayProps) {
  const { deleteResponse } = useFormResponse();
  const { toast } = useToast();
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(
    responses.length > 0 ? responses[0] : null
  );

  const handleDeleteResponse = (responseId: string) => {
    deleteResponse(responseId);
    
    if (selectedResponse?.id === responseId) {
      setSelectedResponse(responses.length > 1 ? responses[0] : null);
    }
    
    toast({
      title: "Response deleted",
      description: "The response has been permanently deleted.",
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const handleExportResponses = () => {
    // Format responses as CSV
    const headers = form.fields.map((field) => field.label).join(",");
    const rows = responses.map((response) => {
      return form.fields
        .map((field) => {
          let value = response.data[field.id] || "";
          // Handle array values (checkboxes)
          if (Array.isArray(value)) {
            value = value.join("; ");
          }
          // Escape quotes and wrap in quotes for CSV
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",");
    });
    
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${form.title}-responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Responses exported",
      description: "Your form responses have been exported as CSV.",
    });
  };

  if (responses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
          <div className="mb-4 rounded-full p-3 bg-muted">
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
              className="h-6 w-6"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold">No responses yet</h3>
          <p className="text-muted-foreground text-center">
            Responses will appear here once your form is submitted.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="table" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="individual">Individual View</TabsTrigger>
        </TabsList>
        <Button onClick={handleExportResponses}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <TabsContent value="table">
        <Card>
          <CardHeader>
            <CardTitle>All Responses</CardTitle>
            <CardDescription>
              {responses.length} {responses.length === 1 ? "response" : "responses"} received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Date</TableHead>
                      {form.fields.map((field) => (
                        <TableHead key={field.id}>{field.label}</TableHead>
                      ))}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response, index) => (
                      <TableRow key={response.id}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell>{formatDate(response.submittedAt)}</TableCell>
                        {form.fields.map((field) => (
                          <TableCell key={field.id}>
                            {Array.isArray(response.data[field.id])
                              ? response.data[field.id].join(", ")
                              : response.data[field.id] || "-"}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteResponse(response.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="individual">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Response List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {responses.map((response, index) => (
                    <div
                      key={response.id}
                      className={`p-3 rounded-md cursor-pointer ${
                        selectedResponse?.id === response.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => setSelectedResponse(response)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Response #{index + 1}</div>
                          <div className="text-xs">
                            {formatDate(response.submittedAt)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResponse(response.id);
                          }}
                          className={
                            selectedResponse?.id === response.id
                              ? "hover:bg-primary/90"
                              : "hover:bg-muted/90"
                          }
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 md:col-span-2">
            {selectedResponse ? (
              <Card>
                <CardHeader>
                  <CardTitle>Response Details</CardTitle>
                  <CardDescription>
                    Submitted on {formatDate(selectedResponse.submittedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {form.fields.map((field) => (
                      <div key={field.id}>
                        <div className="font-medium">{field.label}</div>
                        <div className="mt-1 p-2 bg-muted rounded-md min-h-[40px]">
                          {Array.isArray(selectedResponse.data[field.id])
                            ? selectedResponse.data[field.id].join(", ")
                            : selectedResponse.data[field.id] || "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-6">
                  <p className="text-muted-foreground">
                    Select a response to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
