"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { declarationSchema, DeclarationFormValues, RELATIONS, ASSET_TYPES_IMMOVABLE, ASSET_TYPES_MOVABLE, CURRENCIES } from "./declaration-schema";
import { OwnershipSection, AcquisitionSection } from "./FormSections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { MDAS, BANKS, COUNTRIES } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { Trash2, Plus, CheckCircle2, ChevronRight, ChevronLeft, Save, FileText, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setDraft, setCurrentStep } from "@/lib/store/slices/declarationSlice";
import { RootState } from "@/lib/store/store";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { declarationService } from "@/services/declaration.service";
import { notificationService } from "@/services/notification.service";

const STEPS = [
    { title: "Personal", description: "Basic Info" },
    { title: "Contact", description: "Addresses & IDs" },
    { title: "Family", description: "Dependents" },
    { title: "Employment", description: "Work History" },
    { title: "Cash", description: "Bank Assets" },
    { title: "Immovable", description: "Real Estate" },
    { title: "Movable", description: "Vehicles" },
    { title: "Securities", description: "Shares" },
    { title: "Liabilities", description: "Loans" },
    { title: "Others", description: "Misc Assets" },
    { title: "Review", description: "Submit" }
];

export function DeclarationForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentStep, draft } = useAppSelector((state: RootState) => state.declaration);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    db.submissionQueue.where('synced').equals(0).count().then(count => setPendingCount(count));
    const handleOnline = () => { setIsOnline(true); syncSubmissions(); };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncSubmissions = async () => {
      const pending = await db.submissionQueue.where('synced').equals(0).toArray();
      if (pending.length > 0) {
          toast.message(`Syncing ${pending.length} offline declarations...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          await db.submissionQueue.bulkDelete(pending.map(p => p.id!));
          setPendingCount(0);
          toast.success("All offline declarations synced!");
      }
  };

  const dbDraft = useLiveQuery(() => db.drafts.get("current_draft"));

  const initialValues: DeclarationFormValues = {
    surname: "", firstName: "", otherNames: "", gender: "Male", citizenship: "Sierra Leonean", dob: "", maritalStatus: "Single",
    contact: { 
        phones: ["(+232) "], email: "", confirmEmail: "", permanentAddress: "", presentAddress: "", nationalId: "", district: "", province: "", 
        passportNumber: "", permanentAddressSameAsPresent: false 
    },
    family: [], employment: [], cashAssets: [], immovableAssets: [], movableAssets: [], securities: [], liabilities: [], otherAssets: [],
    declarationDate: new Date().toISOString().split("T")[0],
  };

  const form = useForm<DeclarationFormValues>({
    resolver: zodResolver(declarationSchema) as any, // Cast to avoid strict type mismatch with RHF
    defaultValues: draft ? { ...initialValues, ...JSON.parse(JSON.stringify(draft)) } : initialValues,
    mode: "onChange",
  });

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control: form.control, name: "contact.phones" as any });
  const { fields: familyFields, append: appendFamily, remove: removeFamily } = useFieldArray({ control: form.control, name: "family" });
  const { fields: employmentFields, append: appendEmployment, remove: removeEmployment } = useFieldArray({ control: form.control, name: "employment" });
  const { fields: cashFields, append: appendCash, remove: removeCash } = useFieldArray({ control: form.control, name: "cashAssets" });
  const { fields: immovableFields, append: appendImmovable, remove: removeImmovable } = useFieldArray({ control: form.control, name: "immovableAssets" });
  const { fields: movableFields, append: appendMovable, remove: removeMovable } = useFieldArray({ control: form.control, name: "movableAssets" });
  const { fields: securitiesFields, append: appendSecurity, remove: removeSecurity } = useFieldArray({ control: form.control, name: "securities" });
  const { fields: liabilitiesFields, append: appendLiability, remove: removeLiability } = useFieldArray({ control: form.control, name: "liabilities" });
  const { fields: otherFields, append: appendOther, remove: removeOther } = useFieldArray({ control: form.control, name: "otherAssets" });

  useEffect(() => {
      if (dbDraft && dbDraft.data) {
          const currentValues = form.getValues();
          if (JSON.stringify(currentValues) !== JSON.stringify(dbDraft.data)) {
               form.reset(dbDraft.data);
               toast.info("Draft restored from device storage.");
          }
      }
  }, [dbDraft, form]);

  const saveDraft = () => {
    const values = form.getValues();
    dispatch(setDraft(JSON.parse(JSON.stringify(values))));
    db.drafts.put({ id: "current_draft", data: values, lastUpdated: Date.now() });
    toast.info("Draft saved");
  };

  const nextStep = async () => {
    saveDraft();
    dispatch(setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1)));
  };

  const prevStep = () => {
    saveDraft();
    dispatch(setCurrentStep(Math.max(currentStep - 1, 0)));
  };

  const onSubmit = async (data: DeclarationFormValues) => {
    setIsSubmitting(true);
    if (!isOnline) {
        await db.submissionQueue.add({ data, timestamp: Date.now(), synced: false });
        await db.drafts.delete("current_draft"); 
        setPendingCount(prev => prev + 1);
        setIsSubmitting(false);
        toast.warning("You are offline. Declaration submitted to queue.");
        router.push("/dashboard/officer");
        return;
    }


    try {
        await declarationService.submitDeclaration(data);
        await db.drafts.delete("current_draft"); 
        
        // Notify ADS Admins
        notificationService.addNotification({
            userId: "ROLE:ADS_ADMIN",
            title: "New Declaration Submitted",
            message: `Officer ${data.firstName} ${data.surname} has submitted their declaration.`,
            type: "info",
            link: "/dashboard/ads-admin/declarations"
        });

        toast.success("Declaration submitted successfully!");
        router.push("/dashboard/officer");
    } catch (e) {
        setIsSubmitting(false);
        toast.error("Submission failed.");
    }
  };

  const handleFileUpload = (files: File[], index: number, fieldName: string) => {
    const uploadedDocs = files.map(f => ({
        id: Math.random().toString(36).substring(7),
        name: f.name,
        url: URL.createObjectURL(f), 
        type: f.type
    }));
    const current = form.getValues(`${fieldName}.${index}.documents` as any) || [];
    form.setValue(`${fieldName}.${index}.documents` as any, [...current, ...uploadedDocs]);
    toast.success("Documents attached");
  };

  const handleCreateDraftSubmit = () => {
      const values = form.getValues();
      onSubmit(values); // Re-use submit logic but maybe differentiate if partial? 
      // Requirement: "Draft Submission: Prevent submitted declarations from being saved to drafts."
      // The current onSubmit clears the draft, so that's handled.
      // If user clicks "Save Draft", it saves. If they Submit, it clears.
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Offline Indicators */}
      {!isOnline && <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-600 px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium">Offline Mode</div>}
      {isOnline && pendingCount > 0 && <div className="bg-blue-500/10 border border-blue-500/50 text-blue-600 px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium">{pendingCount} Pending Submissions</div>}

      {/* Stepper */}
      {/* Stepper */}
      <div className="mb-8">
        {/* Desktop Stepper */}
        <div className="hidden md:flex justify-between items-center relative">
             {STEPS.map((step, index) => {
                 let StepIcon = CheckCircle2;
                 if (step.title === "Personal") StepIcon = FileText;
                 const isActive = index === currentStep;
                 const isCompleted = index < currentStep;
                 return (
                    <div key={index} className="flex flex-col items-center flex-1 relative z-10">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${isActive ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg" : isCompleted ? "bg-green-600 text-white border-green-600" : "bg-card text-muted-foreground border-muted"}`}>
                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-bold">{index + 1}</span>}
                        </div>
                        <div className="mt-2 text-center">
                            <h4 className={`text-sm font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{step.title}</h4>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{step.description}</p>
                        </div>
                        {index !== STEPS.length - 1 && (
                            <div className="absolute top-7 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                                <ChevronRight className={`w-6 h-6 ${index < currentStep ? "text-primary" : "text-muted-foreground/30"}`} />
                            </div>
                        )}
                    </div>
                 );
             })}
        </div>

        {/* Mobile Stepper (Reference Design) */}
        <div className="md:hidden flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
            {/* Circular Progress */}
            <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="32" cy="32" r="28"
                        stroke="currentColor" strokeWidth="4" fill="transparent"
                        className="text-muted/20"
                    />
                    <circle
                        cx="32" cy="32" r="28"
                        stroke="currentColor" strokeWidth="4" fill="transparent"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={(2 * Math.PI * 28) - ((currentStep + 1) / STEPS.length) * (2 * Math.PI * 28)}
                        className="text-green-600 transition-all duration-500 ease-out"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {currentStep + 1} of {STEPS.length}
                </div>
            </div>

            {/* Text Info */}
            <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight text-foreground">{STEPS[currentStep].title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    {currentStep < STEPS.length - 1 
                        ? <>Next: <span className="font-medium text-foreground">{STEPS[currentStep + 1].title}</span></>
                        : <span className="text-green-600 font-medium">Final Step</span>
                    }
                </p>
            </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="min-h-[600px] flex flex-col shadow-lg border-muted/60 dark:bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/20 px-8 py-6">
                <CardTitle className="text-2xl font-light tracking-tight">{STEPS[currentStep].title}</CardTitle>
                <CardDescription className="text-base mt-1">{STEPS[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-8 p-8">
              
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="surname" render={({ field }) => <FormItem><FormLabel>Surname</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="firstName" render={({ field }) => <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="otherNames" render={({ field }) => <FormItem><FormLabel>Middle / Other Names</FormLabel><FormControl><Input placeholder="K." {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                     <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="dob" render={({ field }) => <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="citizenship" render={({ field }) => (
                     <FormItem><FormLabel>Citizenship</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Citizenship" /></SelectTrigger></FormControl><SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                     <FormItem><FormLabel>Marital Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent>{["Single", "Married", "Divorced", "Widowed", "Separated"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                  )} />
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                   <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                        <div className="flex justify-between items-center">
                            <Label className="text-base">Phone Numbers</Label>
                             <Button type="button" size="sm" variant="outline" onClick={() => appendPhone("")} className="h-8 border-dashed"><Plus className="w-3 h-3 mr-1" /> Add Number</Button>
                        </div>
                        <div className="space-y-3">
                            {phoneFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <FormField control={form.control} name={`contact.phones.${index}`} render={({ field }) => <FormItem className="flex-1"><FormControl><Input placeholder="+232 77 123456" {...field} /></FormControl><FormMessage /></FormItem>} />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)} disabled={phoneFields.length === 1} className="hover:text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                        </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="contact.email" render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>} />
                      <FormField control={form.control} name="contact.confirmEmail" render={({ field }) => <FormItem><FormLabel>Confirm Email</FormLabel><FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>} />
                   </div>
                   <Separator className="my-2" />
                   <div className="space-y-4">
                       <FormField control={form.control} name="contact.presentAddress" render={({ field }) => <FormItem><FormLabel>Present Address</FormLabel><FormControl><Input placeholder="123 Street..." {...field} /></FormControl><FormMessage /></FormItem>} />
                       <FormField control={form.control} name="contact.permanentAddressSameAsPresent" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/10">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            if(checked) form.setValue("contact.permanentAddress", form.getValues("contact.presentAddress"));
                                            else form.setValue("contact.permanentAddress", "");
                                        }} 
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none"><FormLabel className="cursor-pointer">Permanent Address is same as Present Address</FormLabel></div>
                            </FormItem>
                        )} />
                        {!form.watch("contact.permanentAddressSameAsPresent") && (
                             <FormField control={form.control} name="contact.permanentAddress" render={({ field }) => <FormItem><FormLabel>Permanent Address</FormLabel><FormControl><Input placeholder="456 Ave..." {...field} /></FormControl><FormMessage /></FormItem>} />
                        )}
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="contact.district" render={({ field }) => <FormItem><FormLabel>District</FormLabel><FormControl><Input placeholder="District A" {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="contact.province" render={({ field }) => <FormItem><FormLabel>Province</FormLabel><FormControl><Input placeholder="Province B" {...field} /></FormControl><FormMessage /></FormItem>} />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="contact.nationalId" render={({ field }) => <FormItem><FormLabel>National ID Number</FormLabel><FormControl><Input placeholder="ID-XXXXX" {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name="contact.passportNumber" render={({ field }) => <FormItem><FormLabel>Passport Number (Optional)</FormLabel><FormControl><Input placeholder="P-XXXXX" {...field} /></FormControl><FormMessage /></FormItem>} />
                   </div>
                </div>
              )}

              {currentStep === 2 && (
                   <div className="space-y-6">
                       <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border">
                            <div><h3 className="font-semibold">Family Members</h3><p className="text-xs text-muted-foreground">Add spouse, children, and other dependents.</p></div>
                            <Button type="button" size="sm" onClick={() => appendFamily({ surname: "", firstName: "", middleName: "", relationship: "Child", gender: "Female", occupation: "", institution: "", designation: "" })}><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
                        </div>
                        <div className="space-y-3">
                            {familyFields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border p-4 rounded-xl bg-card hover:bg-accent/5 transition-colors shadow-sm">
                                <div className="md:col-span-3"><FormField control={form.control} name={`family.${index}.surname`} render={({field}) => <FormItem><FormLabel>Surname</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></div>
                                <div className="md:col-span-3"><FormField control={form.control} name={`family.${index}.firstName`} render={({field}) => <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></div>
                                <div className="md:col-span-2"><FormField control={form.control} name={`family.${index}.relationship`} render={({field}) => <FormItem><FormLabel>Relation</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{RELATIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} /></div>
                                <div className="md:col-span-3"><FormField control={form.control} name={`family.${index}.occupation`} render={({field}) => <FormItem><FormLabel>Occupation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></div>
                                <div className="md:col-span-1 flex justify-end pb-2"><Button type="button" variant="ghost" size="icon" onClick={() => removeFamily(index)} className="hover:bg-red-100 hover:text-red-500"><Trash2 className="w-4 h-4 text-red-500" /></Button></div>
                            </div>
                            ))}
                        </div>
                   </div>
               )}

              {currentStep === 3 && (
                   <div className="space-y-6">
                       <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border">
                            <div><h3 className="font-semibold">Employment History</h3></div>
                            <Button type="button" size="sm" onClick={() => appendEmployment({ type: "Current", employer: "", designation: "", startDate: "" })}><Plus className="w-4 h-4 mr-2" /> Add Record</Button>
                        </div>
                        {employmentFields.map((field, index) => (
                        <Card key={field.id} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`employment.${index}.type`} render={({field}) => <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Current">Current</SelectItem><SelectItem value="Past">Past</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
                                <FormField control={form.control} name={`employment.${index}.employer`} render={({field}) => (
                                    <FormItem><FormLabel>Employer / MDA</FormLabel>
                                        <FormControl>
                                            {form.watch(`employment.${index}.type`) === 'Current' ? (
                                                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select MDA" /></SelectTrigger></FormControl><SelectContent>{MDAS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
                                            ) : <Input {...field} placeholder="Organization Name" />}
                                        </FormControl>
                                    <FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`employment.${index}.designation`} render={({field}) => <FormItem><FormLabel>Designation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name={`employment.${index}.annualSalary`} render={({field}) => <FormItem><FormLabel>Annual Salary</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`employment.${index}.startDate`} render={({field}) => <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name={`employment.${index}.endDate`} render={({field}) => <FormItem><FormLabel>End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                            </div>
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeEmployment(index)}>Remove</Button>
                        </Card>
                        ))}
                   </div>
               )}

              {currentStep === 4 && (
                  <div className="space-y-6">
                        <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border">
                            <div><h3 className="font-semibold">Bank Accounts</h3></div>
                            <Button type="button" size="sm" onClick={() => appendCash({ bankName: "", currency: "USD", balance: 0, accountNumber: "", ownership: { owner: "Self", registeredOwner: "" } })}><Plus className="w-4 h-4 mr-2" /> Add Account</Button>
                        </div>
                        {cashFields.map((field, index) => (
                             <Card key={field.id} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-4"><FormField control={form.control} name={`cashAssets.${index}.bankName`} render={({field}) => <FormItem><FormLabel>Bank Name</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Bank" /></SelectTrigger></FormControl><SelectContent>{BANKS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-4"><FormField control={form.control} name={`cashAssets.${index}.accountNumber`} render={({field}) => <FormItem><FormLabel>Account Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-2"><FormField control={form.control} name={`cashAssets.${index}.currency`} render={({field}) => <FormItem><FormLabel>Currency</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-2"><FormField control={form.control} name={`cashAssets.${index}.balance`} render={({field}) => <FormItem><FormLabel>Balance</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>} /></div>
                                </div>
                                <OwnershipSection form={form} index={index} arrayName="cashAssets" />
                                <div className="mt-4 p-4 bg-muted/30">
                                    <Label className="mb-2 block">Statements</Label>
                                    <FileUpload maxSize={2} accept=".pdf,.png,.jpg" onUpload={(files) => handleFileUpload(files, index, "cashAssets")} />
                                    {form.watch(`cashAssets.${index}.documents` as any)?.map((d: any, i: number) => <div key={i} className="text-xs text-green-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> {d.name}</div>)}
                                </div>
                                <Button type="button" variant="ghost" size="sm" className="text-destructive mt-2" onClick={() => removeCash(index)}>Remove</Button>
                             </Card>
                        ))}
                  </div>
              )}

              {currentStep === 5 && (
                  <div className="space-y-6">
                        <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border">
                             <div><h3 className="font-semibold">Real Estate</h3></div>
                             <Button type="button" size="sm" onClick={() => appendImmovable({ type: "Land", location: "", currentValue: 0, ownership: { owner: "Self", registeredOwner: "" }, acquisition: { date: "", cost: 0, mode: "Purchase", financeSource: "" } })}><Plus className="w-4 h-4 mr-2" /> Add Property</Button>
                        </div>
                        {immovableFields.map((field, index) => (
                             <Card key={field.id} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-3"><FormField control={form.control} name={`immovableAssets.${index}.type`} render={({field}) => <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{ASSET_TYPES_IMMOVABLE.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-6"><FormField control={form.control} name={`immovableAssets.${index}.location`} render={({field}) => <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-3"><FormField control={form.control} name={`immovableAssets.${index}.currentValue`} render={({field}) => <FormItem><FormLabel>Est. Value</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>} /></div>
                                </div>
                                <AcquisitionSection form={form} index={index} arrayName="immovableAssets" />
                                <OwnershipSection form={form} index={index} arrayName="immovableAssets" />
                                <div className="mt-4 p-4 bg-muted/30">
                                    <Label className="mb-2 block">Deeds/Titles</Label>
                                    <FileUpload maxSize={5} onUpload={(files) => handleFileUpload(files, index, "immovableAssets")} />
                                    {form.watch(`immovableAssets.${index}.documents` as any)?.map((d: any, i: number) => <div key={i} className="text-xs text-green-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> {d.name}</div>)}
                                </div>
                                <Button type="button" variant="ghost" size="sm" className="text-destructive mt-2" onClick={() => removeImmovable(index)}>Remove</Button>
                             </Card>
                        ))}
                  </div>
              )}

              {currentStep === 6 && (
                  <div className="space-y-6">
                        <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border">
                             <div><h3 className="font-semibold">Movable Assets</h3></div>
                             <Button type="button" size="sm" onClick={() => appendMovable({ type: "Vehicle", description: "", currentValue: 0, ownership: { owner: "Self", registeredOwner: "" }, acquisition: { date: "", cost: 0, mode: "Purchase", financeSource: "" } })}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
                        </div>
                        {movableFields.map((field, index) => (
                             <Card key={field.id} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-3"><FormField control={form.control} name={`movableAssets.${index}.type`} render={({field}) => <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{ASSET_TYPES_MOVABLE.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-6"><FormField control={form.control} name={`movableAssets.${index}.description`} render={({field}) => <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-3"><FormField control={form.control} name={`movableAssets.${index}.currentValue`} render={({field}) => <FormItem><FormLabel>Value</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>} /></div>
                                </div>
                                <AcquisitionSection form={form} index={index} arrayName="movableAssets" />
                                <OwnershipSection form={form} index={index} arrayName="movableAssets" />
                                <div className="mt-4 p-4 bg-muted/30">
                                    <Label className="mb-2 block">Receipts/Registration</Label>
                                    <FileUpload maxSize={5} onUpload={(files) => handleFileUpload(files, index, "movableAssets")} />
                                    {form.watch(`movableAssets.${index}.documents` as any)?.map((d: any, i: number) => <div key={i} className="text-xs text-green-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> {d.name}</div>)}
                                </div>
                                <Button type="button" variant="ghost" size="sm" className="text-destructive mt-2" onClick={() => removeMovable(index)}>Remove</Button>
                             </Card>
                        ))}
                  </div>
              )}

              {currentStep === 7 && (
                  <div className="space-y-6">
                        <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border">
                             <div><h3 className="font-semibold">Securities</h3></div>
                             <Button type="button" size="sm" onClick={() => appendSecurity({ companyName: "", numberOfShares: 0, currentMarketValue: 0, ownership: { owner: "Self", registeredOwner: "" }, acquisition: { date: "", cost: 0, mode: "Purchase", financeSource: "" } })}><Plus className="w-4 h-4 mr-2" /> Add Security</Button>
                        </div>
                        {securitiesFields.map((field, index) => (
                             <Card key={field.id} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-6"><FormField control={form.control} name={`securities.${index}.companyName`} render={({field}) => <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-6"><FormField control={form.control} name={`securities.${index}.currentMarketValue`} render={({field}) => <FormItem><FormLabel>Market Value</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>} /></div>
                                </div>
                                <AcquisitionSection form={form} index={index} arrayName="securities" />
                                <OwnershipSection form={form} index={index} arrayName="securities" />
                                <div className="mt-4 p-4 bg-muted/30">
                                    <Label className="mb-2 block">Certificates</Label>
                                    <FileUpload maxSize={5} onUpload={(files) => handleFileUpload(files, index, "securities")} />
                                    {form.watch(`securities.${index}.documents` as any)?.map((d: any, i: number) => <div key={i} className="text-xs text-green-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> {d.name}</div>)}
                                </div>
                                <Button type="button" variant="ghost" size="sm" className="text-destructive mt-2" onClick={() => removeSecurity(index)}>Remove</Button>
                             </Card>
                        ))}
                  </div>
              )}

              {currentStep === 8 && (
                   <div className="space-y-6">
                        <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border">
                             <div><h3 className="font-semibold">Liabilities</h3></div>
                             <Button type="button" size="sm" onClick={() => appendLiability({ creditorName: "", loanType: "Personal Loan", outstandingAmount: 0 })}><Plus className="w-4 h-4 mr-2" /> Add Liability</Button>
                        </div>
                        {liabilitiesFields.map((field, index) => (
                             <Card key={field.id} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-4"><FormField control={form.control} name={`liabilities.${index}.creditorName`} render={({field}) => <FormItem><FormLabel>Creditor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-4"><FormField control={form.control} name={`liabilities.${index}.loanType`} render={({field}) => <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Personal Loan">Personal Loan</SelectItem><SelectItem value="Mortgage">Mortgage</SelectItem></SelectContent></Select><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-4"><FormField control={form.control} name={`liabilities.${index}.outstandingAmount`} render={({field}) => <FormItem><FormLabel>Outstanding Amount</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>} /></div>
                                </div>
                                <div className="mt-4 p-4 bg-muted/30">
                                    <Label className="mb-2 block">Agreements</Label>
                                    <FileUpload maxSize={5} onUpload={(files) => handleFileUpload(files, index, "liabilities")} />
                                    {form.watch(`liabilities.${index}.documents` as any)?.map((d: any, i: number) => <div key={i} className="text-xs text-green-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> {d.name}</div>)}
                                </div>
                                <Button type="button" variant="ghost" size="sm" className="text-destructive mt-2" onClick={() => removeLiability(index)}>Remove</Button>
                             </Card>
                        ))}
                   </div>
               )}

              {currentStep === 9 && (
                   <div className="space-y-6">
                        <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border">
                             <div><h3 className="font-semibold">Other Assets</h3></div>
                             <Button type="button" size="sm" onClick={() => appendOther({ description: "", value: 0, ownership: { owner: "Self", registeredOwner: "" }, acquisition: { date: "", cost: 0, mode: "Purchase", financeSource: "" } })}><Plus className="w-4 h-4 mr-2" /> Add Asset</Button>
                        </div>
                        {otherFields.map((field, index) => (
                             <Card key={field.id} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-8"><FormField control={form.control} name={`otherAssets.${index}.description`} render={({field}) => <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></div>
                                    <div className="md:col-span-4"><FormField control={form.control} name={`otherAssets.${index}.value`} render={({field}) => <FormItem><FormLabel>Est. Value</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>} /></div>
                                </div>
                                <AcquisitionSection form={form} index={index} arrayName="otherAssets" />
                                <OwnershipSection form={form} index={index} arrayName="otherAssets" />
                                <div className="mt-4 p-4 bg-muted/30">
                                    <Label className="mb-2 block">Supporting Docs</Label>
                                    <FileUpload maxSize={5} onUpload={(files) => handleFileUpload(files, index, "otherAssets")} />
                                    {form.watch(`otherAssets.${index}.documents` as any)?.map((d: any, i: number) => <div key={i} className="text-xs text-green-600 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> {d.name}</div>)}
                                </div>
                                <Button type="button" variant="ghost" size="sm" className="text-destructive mt-2" onClick={() => removeOther(index)}>Remove</Button>
                             </Card>
                        ))}
                   </div>
               )}

              {currentStep === 10 && (
                  <div className="space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="bg-primary/5 p-8 rounded-xl border border-primary/20 space-y-6">
                        <div className="flex items-center gap-3 text-2xl font-light text-primary">
                            <CheckCircle2 className="w-8 h-8" />
                            <span>Ready to Submit</span>
                        </div>
                        <Separator className="bg-primary/10" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-1"><div className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</div><div className="font-medium text-lg">{form.getValues("surname")} {form.getValues("otherNames")}</div></div>
                            <div className="space-y-1"><div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div><div className="font-medium text-lg">{form.getValues("contact.email")}</div></div>
                        </div>
                        <div className="flex p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>By submitting this form, you declare that all information provided is true and accurate to the best of your knowledge.</p>
                        </div>
                    </div>
                  </div>
              )}

            </CardContent>
          </Card>
          
          <div className="sticky bottom-0 -mx-4 -mb-4 p-4 bg-background/95 backdrop-blur border-t z-50 mt-8 rounded-b-lg flex justify-between">
               <div className="flex gap-3">
                   <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}><ChevronLeft className="w-4 h-4 mr-1" /> Previous</Button>
                   <Button type="button" variant="secondary" onClick={saveDraft} className="bg-background border shadow-sm"><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
               </div>
               {currentStep < STEPS.length - 1 ? (
                 <Button type="button" onClick={nextStep}>Next Step <ChevronRight className="w-4 h-4 ml-1" /></Button>
               ) : (
                 <Button type="button" onClick={handleCreateDraftSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">{isSubmitting ? "Submitting..." : "Submit Declaration"}</Button>
               )}
          </div>
        </form>
      </Form>
    </div>
  );
}
