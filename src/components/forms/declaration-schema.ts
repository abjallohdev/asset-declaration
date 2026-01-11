import { z } from "zod";

// --- Enums & Constants ---
export const RELATIONS = ["Spouse", "Child", "Parent", "Sibling", "Other"] as const;
export const ASSET_TYPES_IMMOVABLE = ["Land", "Building", "Farm", "Other"] as const;
export const ASSET_TYPES_MOVABLE = ["Vehicle", "Jewelry", "Furniture", "Electronics", "Artwork", "Other"] as const;
export const CURRENCIES = ["USD", "EUR", "GBP", "NGN", "JPY"] as const;

// --- Sub-Schemas ---

// --- Sub-Schemas & Reusables ---

export const ownershipSchema = z.object({
  owner: z.enum(["Self", "Spouse", "Joint", "Child", "Other"]),
  relation: z.string().optional(), // Required if owner is Child/Other or for context
  registeredOwner: z.string().min(2, "Registered owner name required"),
});

export const acquisitionSchema = z.object({
  date: z.string().optional(), // acq_year or date
  cost: z.number().min(0).optional(),
  currency: z.enum(CURRENCIES).optional(),
  mode: z.enum(["Purchase", "Gift", "Inheritance", "Lottery", "Other"]).optional(),
  financeSource: z.string().optional(),
});

export const documentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().optional(),
  type: z.string().optional(),
});

export const contactDetailsSchema = z.object({
  phones: z.array(z.string().min(8, "Invalid number")).min(1, "At least one phone number is required"),
  email: z.string().email(),
  confirmEmail: z.string().email(),
  
  // Present Address
  presentAddress: z.string().min(5, "Present address required"),
  district: z.string().min(2),
  province: z.string().min(2),

  // Permanent Address
  permanentAddressSameAsPresent: z.boolean().default(false),
  permanentAddress: z.string().optional(),
  // IDs
  nationalId: z.string().min(5, "National ID required"),
  passportNumber: z.string().optional(),
}).refine((data) => data.email === data.confirmEmail, {
    message: "Emails must match",
    path: ["confirmEmail"],
}).refine((data) => data.permanentAddressSameAsPresent || !!data.permanentAddress, {
    message: "Permanent address required",
    path: ["permanentAddress"],
});

export const familySchema = z.object({
  surname: z.string().min(2),
  firstName: z.string().min(2),
  middleName: z.string().optional(),
  relationship: z.enum(RELATIONS),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  
  // Occupation/School
  occupation: z.string().optional(),
  institution: z.string().optional(), // School or Employer Name
  designation: z.string().optional(),
  
  // IDs (if applicable)
  ssn: z.string().optional(),
  pin: z.string().optional(),
});

export const employmentSchema = z.object({
  type: z.enum(["Current", "Past"]),
  employer: z.string().min(2), // mda or company name
  designation: z.string().min(2),
  grade: z.string().optional(),
  contractType: z.string().optional(), // Permanent, Contract, etc.
  
  // IDs
  empId: z.string().optional(),
  ssn: z.string().optional(),
  pin: z.string().optional(), // Employee PIN
  establishmentRegNo: z.string().optional(),

  // Dates
  startDate: z.string(),
  endDate: z.string().optional(),
  
  // Financials
  annualSalary: z.number().min(0).optional(),
  currency: z.enum(CURRENCIES).optional(),
  allowances: z.number().min(0).optional(),
  allowanceDetails: z.string().optional(),
  incomeSource: z.string().optional(), // if multiple sources
});

export const cashAssetSchema = z.object({
  bankName: z.string().min(2),
  accountNumber: z.string().min(2),
  currency: z.enum(CURRENCIES),
  type: z.string().optional(), // Savings, Current, Fixed
  balance: z.number().min(0),
  location: z.string().optional(), // Branch location
  
  // Ownership & Source
  ownership: ownershipSchema,
  sourceOfIncome: z.string().optional(), // Specific to cash deposit source
  
  documents: z.array(documentSchema).optional(),
});

export const immovableAssetSchema = z.object({
  type: z.enum(ASSET_TYPES_IMMOVABLE),
  location: z.string().min(2),
  plotNumber: z.string().optional(),
  size: z.string().optional(),
  
  // Valuation & Acquisition
  currentValue: z.number().min(0),
  currency: z.enum(CURRENCIES).optional(),
  acquisition: acquisitionSchema,

  // Ownership
  ownership: ownershipSchema,
  
  documents: z.array(documentSchema).optional(),
});

export const movableAssetSchema = z.object({
  type: z.enum(ASSET_TYPES_MOVABLE),
  description: z.string().min(2), // Make/Model
  registrationNumber: z.string().optional(),
  purpose: z.string().optional(), // Personal, Commercial
  location: z.string().optional(),

  // Valuation & Acquisition
  currentValue: z.number().min(0),
  currency: z.enum(CURRENCIES).optional(),
  acquisition: acquisitionSchema,

  // Ownership
  ownership: ownershipSchema,

  documents: z.array(documentSchema).optional(),
});

export const securitiesSchema = z.object({
  companyName: z.string().min(2),
  type: z.string().optional(), // Shares, Bonds, etc.
  certificateNumber: z.string().optional(),
  numberOfShares: z.number().min(0),
  yearlyInterest: z.number().min(0).optional(),

  // Valuation & Acquisition
  currentMarketValue: z.number().min(0),
  currency: z.enum(CURRENCIES).optional(),
  acquisition: acquisitionSchema,

  // Ownership
  ownership: ownershipSchema,

  documents: z.array(documentSchema).optional(),
});

export const liabilitySchema = z.object({
  creditorName: z.string().min(2),
  creditorLocation: z.string().optional(),
  loanType: z.string(),
  purpose: z.string().optional(),
  
  // Amounts
  loanAmount: z.number().min(0).optional(), // Original amount
  outstandingAmount: z.number().min(0),
  currency: z.enum(CURRENCIES).optional(),
  
  // Terms
  repaymentTerms: z.string().optional(), // Monthly, Yearly
  maturityDate: z.string().optional(),
  
  // Ownership (Who owes this?)
  debtorName: z.string().optional(), // Usually self, but could be joint
  
  documents: z.array(documentSchema).optional(),
});

export const otherAssetSchema = z.object({
  description: z.string().min(2),
  location: z.string().optional(),
  
  // Valuation & Acquisition
  value: z.number().min(0),
  currency: z.enum(CURRENCIES).optional(),
  acquisition: acquisitionSchema,
  
  // Ownership
  ownership: ownershipSchema,

  documents: z.array(documentSchema).optional(),
});

export const declarationSchema = z.object({
  // Step 1: Personal (Exisiting)
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  firstName: z.string().min(2, "First Name must be at least 2 characters"),
  otherNames: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"], { message: "Please select a gender" }),
  citizenship: z.string().min(2, "Citizenship is required"),
  dob: z.string().refine((val) => new Date(val) <= new Date(), "Date of birth cannot be in the future"),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed", "Separated"], { message: "Please select a marital status" }),

  // Step 2: Contact
  contact: contactDetailsSchema,

  // Step 3: Family
  family: z.array(familySchema),

  // Step 4: Employment
  employment: z.array(employmentSchema),
  // Deprecated top-level optional fields kept for type safety if needed, can remove if refactoring all usage
  mda: z.string().optional(), 
  designation: z.string().optional(), 

  // Step 5: Cash Assets
  cashAssets: z.array(cashAssetSchema).optional(), // Optional but if present must be valid

  // Step 6: Immovable Assets
  immovableAssets: z.array(immovableAssetSchema).optional(),

  // Step 7: Movable Assets
  movableAssets: z.array(movableAssetSchema).optional(),

  // Step 8: Securities
  securities: z.array(securitiesSchema).optional(),

  // Step 9: Liabilities
  liabilities: z.array(liabilitySchema).optional(),

  // Step 10: Other Assets
  otherAssets: z.array(otherAssetSchema).optional(),

  // Step 11: Submission
  declarationDate: z.string(),
});

export type DeclarationFormValues = z.infer<typeof declarationSchema>;
