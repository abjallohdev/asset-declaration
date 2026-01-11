import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeclarationFormValues } from '@/components/forms/declaration-schema';

interface DeclarationState {
  currentStep: number;
  draft: Partial<DeclarationFormValues>;
  isDirty: boolean; // Has unsaved changes
}

const initialState: DeclarationState = {
  currentStep: 0,
  draft: {},
  isDirty: false,
};

export const declarationSlice = createSlice({
  name: 'declaration',
  initialState,
  reducers: {
    setDraft: (state, action: PayloadAction<Partial<DeclarationFormValues>>) => {
      state.draft = { ...state.draft, ...action.payload };
      state.isDirty = true;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    clearDraft: (state) => {
      state.draft = {};
      state.currentStep = 0;
      state.isDirty = false;
    },
    markSaved: (state) => {
        state.isDirty = false;
    }
  },
});

export const { setDraft, setCurrentStep, clearDraft, markSaved } = declarationSlice.actions;

export default declarationSlice.reducer;
