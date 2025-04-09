
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, LayoutDashboard } from "lucide-react";
import { useFormBuilder } from "@/contexts/FormBuilderContext";

export function AppHeader() {
  const navigate = useNavigate();
  const { createNewForm } = useFormBuilder();
  
  const handleCreateForm = () => {
    createNewForm();
    navigate('/builder');
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-brand-purple text-white p-1.5 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </div>
            <span className="text-xl font-bold">Form Craft</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button onClick={handleCreateForm}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Form
          </Button>
        </div>
      </div>
    </header>
  );
}
