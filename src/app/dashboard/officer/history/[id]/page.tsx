"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Declaration } from "@/lib/mock-data"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer } from "lucide-react";
import { declarationService } from "@/services/declaration.service";

export default function OfficerDeclarationDetail() {
  const params = useParams();
  const router = useRouter();
  const [declaration, setDeclaration] = useState<any | null>(null); // Use any to support extended fields
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    declarationService.getMyDeclarations()
      .then(data => {
          const found = data.find((d: any) => d.id === params.id);
          setDeclaration(found || null);
          setLoading(false);
      })
      .catch(err => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="p-8">Loading detail...</div>;
  if (!declaration) return <div className="p-8">Declaration not found</div>;

  return (
    <>
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #declaration-document, #declaration-document * {
            visibility: visible;
          }
          #declaration-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border: none;
          }
          /* Hide non-printable elements */
          header, nav, aside, .no-print {
            display: none !important;
          }
        }
      `}} />

      <div className="flex items-center gap-4 no-print mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Declaration Details</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                 Reference: {declaration.id}
            </div>
        </div>
        <div className="ml-auto flex gap-2">
            <Button onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" /> Print / Save as PDF
            </Button>
        </div>
      </div>

      <div id="declaration-document" className="bg-white text-black p-10 max-w-5xl mx-auto shadow-sm border rounded-lg print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* Header */}
        <div className="text-center mb-10 border-b-2 border-slate-900 pb-6">
             <div className="flex justify-center mb-4">
               {/* Placeholder for Coat of Arms */}
               <div className="w-20 h-20 border-4 border-slate-900 rounded-full flex items-center justify-center font-serif font-bold text-3xl">
                 SL
               </div>
             </div>
             <h2 className="text-xl font-bold uppercase tracking-wider mb-2">Republic of Sierra Leone</h2>
             <h1 className="text-4xl font-serif font-bold uppercase mb-2">Asset Declaration Form</h1>
             <p className="text-sm font-medium text-slate-700">Anti-Corruption Act, 2008 (Section 119)</p>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-sm bg-slate-50 p-6 rounded-lg print:bg-transparent print:p-0">
             <div className="flex justify-between border-b border-dotted border-slate-400 pb-1">
                <span className="font-bold text-slate-600">Status:</span> 
                <span className="uppercase font-semibold">{declaration.status}</span>
             </div>
             <div className="flex justify-between border-b border-dotted border-slate-400 pb-1">
                <span className="font-bold text-slate-600">Declaration Year:</span> 
                <span className="font-semibold">{declaration.year}</span>
             </div>
             <div className="flex justify-between border-b border-dotted border-slate-400 pb-1">
                <span className="font-bold text-slate-600">Submission Date:</span> 
                <span className="font-semibold">{declaration.date}</span>
             </div>
              <div className="flex justify-between border-b border-dotted border-slate-400 pb-1">
                <span className="font-bold text-slate-600">Reference ID:</span> 
                <span className="font-mono font-semibold">{declaration.id}</span>
             </div>
        </div>

        {/* Section 1: Personal Information */}
        <div className="mb-10 page-break-inside-avoid">
            <h3 className="bg-slate-900 text-white px-4 py-2 font-bold uppercase text-sm mb-6 print:bg-slate-200 print:text-black">1. Personal Information</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
                <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 uppercase text-xs font-semibold self-center">Surname</span>
                    <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.surname}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 uppercase text-xs font-semibold self-center">First Name</span>
                    <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.firstName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 uppercase text-xs font-semibold self-center">Other Names</span>
                    <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.otherNames}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 uppercase text-xs font-semibold self-center">Gender</span>
                    <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.gender}</span>
                </div>
                 <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 uppercase text-xs font-semibold self-center">Date of Birth</span>
                    <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.dob}</span>
                </div>
                 <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 uppercase text-xs font-semibold self-center">Marital Status</span>
                    <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.maritalStatus}</span>
                </div>
                 <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 uppercase text-xs font-semibold self-center">Citizenship</span>
                    <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.citizenship}</span>
                </div>
            </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="mb-10 page-break-inside-avoid">
            <h3 className="bg-slate-900 text-white px-4 py-2 font-bold uppercase text-sm mb-6 print:bg-slate-200 print:text-black">2. Contact Details</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
                <div className="grid grid-cols-3 gap-2">
                     <span className="text-slate-500 uppercase text-xs font-semibold self-center">Mobile</span>
                     <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.contact?.phones?.join(", ")}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                     <span className="text-slate-500 uppercase text-xs font-semibold self-center">Email</span>
                     <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.contact?.email}</span>
                </div>
                 <div className="grid grid-cols-3 gap-2">
                     <span className="text-slate-500 uppercase text-xs font-semibold self-center">National ID</span>
                     <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.contact?.nationalId}</span>
                </div>
                 <div className="grid grid-cols-3 gap-2">
                     <span className="text-slate-500 uppercase text-xs font-semibold self-center">Passport No.</span>
                     <span className="col-span-2 font-medium border-b border-slate-200 pb-1">{declaration.contact?.passportNumber}</span>
                </div>
                <div className="col-span-2 grid grid-cols-6 gap-2">
                     <span className="text-slate-500 uppercase text-xs font-semibold self-center col-span-1">Present Address</span>
                     <span className="col-span-5 font-medium border-b border-slate-200 pb-1">{declaration.contact?.presentAddress}, {declaration.contact?.district}, {declaration.contact?.province}</span>
                </div>
                <div className="col-span-2 grid grid-cols-6 gap-2">
                     <span className="text-slate-500 uppercase text-xs font-semibold self-center col-span-1">Permanent Addr.</span>
                     <span className="col-span-5 font-medium border-b border-slate-200 pb-1">
                        {declaration.contact?.permanentAddressSameAsPresent ? "Same as Present Address" : 
                         `${declaration.contact?.permanentAddress}, ${declaration.contact?.permanentDistrict}, ${declaration.contact?.permanentProvince}`}
                     </span>
                </div>
            </div>
        </div>

        {/* Section 3: Family */}
         <div className="mb-10 page-break-inside-avoid">
            <h3 className="bg-slate-900 text-white px-4 py-2 font-bold uppercase text-sm mb-4 print:bg-slate-200 print:text-black">3. Family Members</h3>
            {declaration.family?.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse border border-slate-200 min-w-[600px]">
                        <thead className="bg-slate-50 print:bg-slate-100">
                            <tr>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Full Name</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Relationship</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Gender</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">DOB</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Occupation/School</th>
                            </tr>
                        </thead>
                        <tbody>
                            {declaration.family.map((member: any, i: number) => (
                                <tr key={i}>
                                    <td className="p-2 border border-slate-200">{member.surname}, {member.firstName} {member.middleName}</td>
                                    <td className="p-2 border border-slate-200">{member.relationship}</td>
                                    <td className="p-2 border border-slate-200">{member.gender}</td>
                                    <td className="p-2 border border-slate-200">{member.dob}</td>
                                    <td className="p-2 border border-slate-200">{member.occupation || member.institution || member.designation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <p className="text-sm italic text-slate-500 py-2">No family members declared.</p>}
        </div>

         {/* Section 4: Employment */}
         <div className="mb-10 page-break-inside-avoid">
            <h3 className="bg-slate-900 text-white px-4 py-2 font-bold uppercase text-sm mb-4 print:bg-slate-200 print:text-black">4. Employment History</h3>
             {declaration.employment?.length > 0 ? (
                 declaration.employment.map((emp: any, i: number) => (
                    <div key={i} className="mb-6 p-4 border border-slate-200 rounded print:border-slate-300">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div className="col-span-2 font-bold text-base mb-2 border-b border-slate-100 pb-1">{emp.employer} <span className="text-slate-400 font-normal">({emp.type})</span></div>
                            <div className="grid grid-cols-3"><span className="text-slate-500 uppercase text-xs">Designation:</span><span className="col-span-2">{emp.designation}</span></div>
                            <div className="grid grid-cols-3"><span className="text-slate-500 uppercase text-xs">Period:</span><span className="col-span-2">{emp.startDate} - {emp.endDate || "Present"}</span></div>
                            <div className="grid grid-cols-3"><span className="text-slate-500 uppercase text-xs">Annual Salary:</span><span className="col-span-2 font-mono">{emp.currency} {emp.annualSalary?.toLocaleString()}</span></div>
                            <div className="grid grid-cols-3"><span className="text-slate-500 uppercase text-xs">Allowances:</span><span className="col-span-2 font-mono">{emp.allowances?.toLocaleString()} <span className="text-slate-400 text-xs">({emp.allowanceDetails})</span></span></div>
                            <div className="grid grid-cols-3"><span className="text-slate-500 uppercase text-xs">Emp ID / PIN:</span><span className="col-span-2">{emp.empId} / {emp.pin}</span></div>
                        </div>
                    </div>
                 ))
             ) : <p className="text-sm italic text-slate-500 py-2">No employment history declared.</p>}
        </div>

        {/* Section 5: Assets */}
        <div className="mb-10">
             <h3 className="bg-slate-900 text-white px-4 py-2 font-bold uppercase text-sm mb-4 print:bg-slate-200 print:text-black">5. Declared Assets</h3>
             
             {/* 5.1 Cash */}
             <div className="mb-6 page-break-inside-avoid">
                 <h4 className="font-bold text-sm mb-3 border-b-2 border-slate-300 pb-1 inline-block uppercase text-slate-700">5.1 Cash & Bank Balances</h4>
                 {declaration.cashAssets?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse border border-slate-200 min-w-[600px]">
                            <thead className="bg-slate-50 print:bg-slate-100">
                                <tr>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Bank Name</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Account No.</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Owner</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600 text-right">Balance</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Docs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {declaration.cashAssets.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td className="p-2 border border-slate-200">{item.bankName}</td>
                                        <td className="p-2 border border-slate-200 font-mono text-xs">{item.accountNumber}</td>
                                        <td className="p-2 border border-slate-200 text-xs">{item.ownership?.owner}</td>
                                        <td className="p-2 border border-slate-200 text-right font-mono font-medium">{item.currency} {item.balance?.toLocaleString()}</td>
                                        <td className="p-2 border border-slate-200 text-xs text-slate-500">{item.documents?.map((d:any)=>d.name).join(", ")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 ) : <p className="text-sm italic text-slate-500 pl-4 border-l-2 border-slate-200">None Declared</p>}
             </div>

             {/* 5.2 Immovable */}
             <div className="mb-6 page-break-inside-avoid">
                 <h4 className="font-bold text-sm mb-3 border-b-2 border-slate-300 pb-1 inline-block uppercase text-slate-700">5.2 Real Estate (Immovable)</h4>
                  {declaration.immovableAssets?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse border border-slate-200 min-w-[600px]">
                            <thead className="bg-slate-50 print:bg-slate-100">
                                <tr>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Type</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Location</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Acquisition</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600 text-right">Est. Value</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Docs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {declaration.immovableAssets.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td className="p-2 border border-slate-200">{item.type} <span className="text-xs text-slate-400 block">{item.size}</span></td>
                                        <td className="p-2 border border-slate-200">{item.location} <span className="text-xs text-slate-400 block">Plot: {item.plotNumber}</span></td>
                                        <td className="p-2 border border-slate-200 text-xs">{item.acquisition?.date} ({item.acquisition?.mode}) <br/> Cost: {item.acquisition?.currency}{item.acquisition?.cost?.toLocaleString()}</td>
                                        <td className="p-2 border border-slate-200 text-right font-mono font-medium">{item.currency} {item.currentValue?.toLocaleString()}</td>
                                        <td className="p-2 border border-slate-200 text-xs text-slate-500">{item.documents?.map((d:any)=>d.name).join(", ")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  ) : <p className="text-sm italic text-slate-500 pl-4 border-l-2 border-slate-200">None Declared</p>}
             </div>

             {/* 5.3 Movable */}
             <div className="mb-6 page-break-inside-avoid">
                 <h4 className="font-bold text-sm mb-3 border-b-2 border-slate-300 pb-1 inline-block uppercase text-slate-700">5.3 Vehicles & Movable Assets</h4>
                  {declaration.movableAssets?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse border border-slate-200 min-w-[600px]">
                            <thead className="bg-slate-50 print:bg-slate-100">
                                <tr>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Type</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Description</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Acquisition</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600 text-right">Value</th>
                                    <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Docs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {declaration.movableAssets.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td className="p-2 border border-slate-200">{item.type}</td>
                                        <td className="p-2 border border-slate-200">{item.description}</td>
                                         <td className="p-2 border border-slate-200 text-xs">{item.acquisition?.date} ({item.acquisition?.mode}) <br/> Cost: {item.acquisition?.currency}{item.acquisition?.cost?.toLocaleString()}</td>
                                        <td className="p-2 border border-slate-200 text-right font-mono font-medium">{item.currency} {item.currentValue?.toLocaleString()}</td>
                                        <td className="p-2 border border-slate-200 text-xs text-slate-500">{item.documents?.map((d:any)=>d.name).join(", ")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  ) : <p className="text-sm italic text-slate-500 pl-4 border-l-2 border-slate-200">None Declared</p>}
             </div>

              {/* 5.4 Securities */}
             <div className="mb-6 page-break-inside-avoid">
                 <h4 className="font-bold text-sm mb-3 border-b-2 border-slate-300 pb-1 inline-block uppercase text-slate-700">5.4 Securities & Shares</h4>
                  {declaration.securities?.length > 0 ? (
                    <table className="w-full text-sm text-left border-collapse border border-slate-200">
                        <thead className="bg-slate-50 print:bg-slate-100">
                            <tr>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Company</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Shares</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600 text-right">Market Value</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Docs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {declaration.securities.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td className="p-2 border border-slate-200">{item.companyName}</td>
                                    <td className="p-2 border border-slate-200 font-mono text-center">{item.numberOfShares}</td>
                                    <td className="p-2 border border-slate-200 text-right font-mono font-medium">{item.currency} {item.currentMarketValue?.toLocaleString()}</td>
                                    <td className="p-2 border border-slate-200 text-xs text-slate-500">{item.documents?.map((d:any)=>d.name).join(", ")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 ) : <p className="text-sm italic text-slate-500 pl-4 border-l-2 border-slate-200">None Declared</p>}
             </div>
        </div>

        {/* Section 6: Liabilities */}
         <div className="mb-10 page-break-inside-avoid">
            <h3 className="bg-slate-900 text-white px-4 py-2 font-bold uppercase text-sm mb-4 print:bg-slate-200 print:text-black">6. Liabilities</h3>
            {declaration.liabilities?.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse border border-slate-200 min-w-[600px]">
                        <thead className="bg-slate-50 print:bg-slate-100">
                            <tr>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Creditor</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Loan Type</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Terms</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600 text-right">Outstanding</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Docs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {declaration.liabilities.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td className="p-2 border border-slate-200">{item.creditorName}</td>
                                    <td className="p-2 border border-slate-200">{item.loanType}</td>
                                    <td className="p-2 border border-slate-200 text-xs">{item.repaymentTerms}, Due: {item.maturityDate}</td>
                                    <td className="p-2 border border-slate-200 text-right font-mono font-medium text-red-600">{item.currency} {item.outstandingAmount?.toLocaleString()}</td>
                                    <td className="p-2 border border-slate-200 text-xs text-slate-500">{item.documents?.map((d:any)=>d.name).join(", ")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <p className="text-sm italic text-slate-500 py-2">No liabilities declared.</p>}
        </div>

         {/* Section 7: Other Assets */}
         {declaration.otherAssets?.length > 0 && (
            <div className="mb-10 page-break-inside-avoid">
                <h3 className="bg-slate-900 text-white px-4 py-2 font-bold uppercase text-sm mb-4 print:bg-slate-200 print:text-black">7. Other Assets</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse border border-slate-200 min-w-[600px]">
                        <thead className="bg-slate-50 print:bg-slate-100">
                            <tr>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Description</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600 text-right">Value</th>
                                <th className="p-2 border border-slate-200 font-semibold uppercase text-xs text-slate-600">Docs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {declaration.otherAssets.map((item: any, i: number) => (
                                <tr key={i}>
                                    <td className="p-2 border border-slate-200">{item.description}</td>
                                    <td className="p-2 border border-slate-200 text-right font-mono font-medium">{item.currency} {item.value?.toLocaleString()}</td>
                                    <td className="p-2 border border-slate-200 text-xs text-slate-500">{item.documents?.map((d:any)=>d.name).join(", ")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
         )}


        {/* Footer / Signature */}
        <div className="mt-16 pt-8 border-t-2 border-slate-900 page-break-inside-avoid">
            <h3 className="font-bold uppercase text-sm mb-4">Declaration</h3>
            <p className="text-sm mb-8 text-justify leading-relaxed">
                I, <span className="font-bold uppercase">{declaration.surname}, {declaration.firstName} {declaration.otherNames}</span>, hereby declare that the information provided in this form is true, complete, and accurate to the best of my knowledge. I understand that any false declaration or failure to declare assets as required by law constitutes an offense under the Anti-Corruption Act.
            </p>

            <div className="flex justify-between mt-16">
                <div className="border-t border-dotted border-slate-400 pt-2 w-64 text-center">
                    <p className="text-sm font-bold">Signature of Officer</p>
                </div>
                <div className="border-t border-dotted border-slate-400 pt-2 w-40 text-center">
                    <p className="text-sm font-bold">Date</p>
                    <p className="text-xs text-slate-500">{new Date(declaration.declarationDate || declaration.date).toLocaleDateString()}</p>
                </div>
            </div>

             {declaration.status === 'VERIFIED' && (
                 <div className="mt-12 p-4 border-4 border-double border-slate-300 rounded text-center max-w-xs mx-auto opacity-80 print:opacity-100">
                    <p className="text-xs font-bold uppercase text-slate-500 mb-2">For Official Use Only</p>
                    <div className="inline-block border-2 border-green-600 text-green-700 font-bold px-4 py-2 rounded uppercase tracking-widest text-lg transform -rotate-2">
                        VERIFIED
                    </div>
                    <p className="text-xs mt-2 text-slate-500">Verified by ADS Compliance Unit</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{new Date().toLocaleDateString()}</p>
                 </div>
             )}
        </div>
      </div>
    </>
  );
}
