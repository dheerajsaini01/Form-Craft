
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormBuilderProvider } from "@/contexts/FormBuilderContext";
import { FormResponseProvider } from "@/contexts/FormResponseContext";

import Dashboard from "./pages/Dashboard";
import FormBuilder from "./pages/FormBuilder";
import FormView from "./pages/FormView";
import FormResponses from "./pages/FormResponses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FormBuilderProvider>
      <FormResponseProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/builder/:formId?" element={<FormBuilder />} />
              <Route path="/view/:formId" element={<FormView />} />
              <Route path="/responses/:formId" element={<FormResponses />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FormResponseProvider>
    </FormBuilderProvider>
  </QueryClientProvider>
);

export default App;
