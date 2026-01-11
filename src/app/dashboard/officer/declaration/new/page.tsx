"use client";

import { DeclarationForm } from "@/components/forms/DeclarationForm";

export default function NewDeclarationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">New Asset Declaration</h1>
        <p className="text-muted-foreground">
          Please complete all sections of the form accurately.
        </p>
      </div>
      <DeclarationForm />
    </div>
  );
}
