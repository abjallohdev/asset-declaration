import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CURRENCIES, ASSET_TYPES_IMMOVABLE } from "./declaration-schema"; // Importing definitions

// Reusable Ownership Section
export const OwnershipSection = ({ form, index, arrayName }: { form: UseFormReturn<any>, index: number, arrayName: string }) => {
  return (
    <div className="space-y-4 p-4 border rounded-md bg-muted/10 mt-4">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Ownership Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`${arrayName}.${index}.ownership.owner`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Owner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["Self", "Spouse", "Joint", "Child", "Other"].map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${arrayName}.${index}.ownership.relation`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relation (if Joint/Other)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Spouse, Business Partner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${arrayName}.${index}.ownership.registeredOwner`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registered Name</FormLabel>
              <FormControl>
                <Input placeholder="Name on Title/Doc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// Reusable Acquisition Section
export const AcquisitionSection = ({ form, index, arrayName }: { form: UseFormReturn<any>, index: number, arrayName: string }) => {
  return (
    <div className="space-y-4 p-4 border rounded-md bg-green-50/50 dark:bg-green-900/10 mt-2">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Acquisition Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name={`${arrayName}.${index}.acquisition.date`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Acquired</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${arrayName}.${index}.acquisition.mode`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["Purchase", "Gift", "Inheritance", "Lottery", "Other"].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${arrayName}.${index}.acquisition.cost`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acquisition Cost</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${arrayName}.${index}.acquisition.financeSource`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source of Finance</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Salary, Loan, Savings" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
