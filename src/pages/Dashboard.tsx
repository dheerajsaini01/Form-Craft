
import React, { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { FormList } from "@/components/forms/FormList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormTemplates } from "@/components/form-builder/FormTemplates";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">My Forms</h1>
        
        <Tabs defaultValue="forms">
          <TabsList className="mb-6">
            <TabsTrigger value="forms">My Forms</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forms">
            <FormList />
          </TabsContent>
          
          <TabsContent value="templates">
            <h2 className="text-2xl font-semibold mb-4">Form Templates</h2>
            <p className="text-muted-foreground mb-6">
              Choose a template to get started quickly. You can customize it after creation.
            </p>
            <FormTemplates />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
