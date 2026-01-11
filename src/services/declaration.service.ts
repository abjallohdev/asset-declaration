import { api } from "@/lib/api";
import { Declaration } from "@/lib/mock-data";
import { DeclarationFormValues } from "@/components/forms/declaration-schema";

export const declarationService = {
  // Officer Methods
  getMyDeclarations: async (): Promise<Declaration[]> => {
    return api.get<Declaration[]>('/api/officer/declarations');
  },

  getById: async (id: string): Promise<Declaration | undefined> => {
      const decls = await api.get<Declaration[]>('/api/officer/declarations');
      return decls.find(d => d.id === id);
  },

  submitDeclaration: async (data: DeclarationFormValues): Promise<{ success: boolean; id: string }> => {
    // Attach userId from session (for JSON server compatibility)
    let userId = "u3"; // Default fallback
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem("ads_user_session");
        if (stored) {
            const user = JSON.parse(stored);
            userId = user.id;
        }
    }
    const payload = { ...data, userId };
    return api.post<{ success: boolean; id: string }>('/api/officer/declarations', payload);
  },

  saveDraft: async (data: DeclarationFormValues) => {
    return api.post('/api/officer/declarations/draft', data);
  },

  // Verifier Methods (Could be split if role complexity grows)
  getAssignments: async (): Promise<any[]> => {
      return api.get<any[]>('/api/verifier/assignments');
  },

  verifyDeclaration: async (id: string, remarks?: string): Promise<any> => {
      return api.patch(`/api/ads-admin/declarations/${id}/status`, { status: "VERIFIED", remarks });
  }
};
