
export type UserRole = "ACC_ADMIN" | "SUPER_ADMIN" | "PUBLIC_OFFICER" | "PUBLIC_USER" | "VERIFIER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  mda?: string; // Ministry/Department/Agency
  designation?: string;
  status?: "Active" | "Inactive" | "Suspended";
  lastLogin?: string;
}

export interface Declaration {
  id: string;
  userId: string;
  year: number;
  date: string; // ISO date
  status: "DRAFT" | "SUBMITTED" | "VERIFIED" | "REJECTED" | "PENDING_VERIFICATION";
  assets: {
    cash: number;
    immovable: number;
    movable: number;
    securities: number;
    other: number;
  };
  liabilities: number;
  // Extended fields for details view
  surname?: string;
  firstName?: string;
  otherNames?: string;
  gender?: string;
  dob?: string;
  citizenship?: string;
  maritalStatus?: string;
  declarationDate?: string;
  contact?: {
      phones?: string[];
      email?: string;
      permanentAddress?: string;
      presentAddress?: string;
      district?: string;
      province?: string;
      permanentDistrict?: string;
      permanentProvince?: string;
      permanentAddressSameAsPresent?: boolean;
      nationalId?: string;
      passportNumber?: string;
  };
  family?: any[];
  employment?: any[];
  cashAssets?: any[];
  immovableAssets?: any[];
  movableAssets?: any[];
  securities?: any[];
  otherAssets?: any[];
  documents?: any[];
}


export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  status: "Success" | "Failed";
}

export interface Report {
  id: string;
  title: string;
  date: string;
  type: "Verification" | "Compliance" | "System";
  status: "Ready" | "Generating";
}

export const USERS: User[] = [
  {
    id: "u1",
    name: "System Administrator",
    email: "superadmin@ads.gov",
    role: "SUPER_ADMIN",
    designation: "Super Admin",
    status: "Active",
    lastLogin: "2024-03-10 09:45 AM",
  },
  {
    id: "u2",
    name: "ACC Administrator",
    email: "admin@ads.gov",
    role: "ACC_ADMIN",
    designation: "ADS Manager",
    status: "Active",
    lastLogin: "2024-03-11 08:30 AM",
  },
  {
    id: "u3",
    name: "John Officer",
    email: "officer@ads.gov",
    role: "PUBLIC_OFFICER",
    mda: "Ministry of Finance",
    designation: "Senior Officer",
    status: "Active",
    lastLogin: "2024-03-12 10:15 AM",
  },
  {
    id: "u4",
    name: "Jane Citizen",
    email: "user@ads.gov",
    role: "PUBLIC_USER",
    designation: "Citizen",
    status: "Active",
    lastLogin: "2024-03-09 02:20 PM",
  }
];

export const MDAS = [
  "Ministry of Finance",
  "Ministry of Health",
  "Ministry of Education",
  "Department of Public Works",
  "Revenue Authority",
];

export const DISTRICTS = [
  "Central District",
  "North District",
  "South District",
  "East District",
  "West District",
];

export const CURRENCIES = ["USD", "EUR", "GBP", "NGN", "ZAR", "KES", "SLE"];

export const BANKS = [
  "Bank of Sierra Leone (BSL)",
  "Rokel Commercial Bank",
  "Sierra Leone Commercial Bank (SLCB)",
  "Union Trust Bank (UTB)",
  "Ecobank Sierra Leone",
  "Guaranty Trust Bank (GTBank)",
  "United Bank for Africa (UBA)",
  "Zenith Bank",
  "Access Bank",
  "Standard Chartered Bank",
  "First International Bank (FIB)",
  "Skye Bank",
  "Bloom Bank Africa",
  "Vista Bank"
];

export const COUNTRIES = [
  "Sierra Leone", "Nigeria", "Ghana", "Liberia", "Gambia", "Guinea", "Ivory Coast", 
  "Senegal", "Mali", "Burkina Faso", "Togo", "Benin", "Niger", "Chad", "Cameroon", 
  "United Kingdom", "United States", "Canada"
];

// ... (other interfaces)

export const DECLARATIONS: Declaration[] = [
  {
    id: "d1",
    userId: "u3",
    year: 2024,
    date: "2024-01-15",
    status: "SUBMITTED",
    assets: {
      cash: 50000,
      immovable: 200000,
      movable: 15000,
      securities: 10000,
      other: 5000,
    },
    liabilities: 0,
    // Detailed Data for John Officer
    surname: "Officer", firstName: "John", otherNames: "Kwame", gender: "Male", dob: "1980-05-15", citizenship: "Sierra Leonean", maritalStatus: "Married",
    contact: {
        phones: ["(+232) 77 123456"], email: "officer@ads.gov", 
        presentAddress: "123 Hill Station, Freetown", district: "Urban", province: "Western Area",
        permanentAddress: "45 Bo Road, Bo", permanentDistrict: "Bo", permanentProvince: "Southern",
        nationalId: "SL-1980-12345", passportNumber: "P0012345"
    },
    family: [
        { surname: "Officer", firstName: "Mary", relationship: "Spouse", gender: "Female", occupation: "Teacher" },
        { surname: "Officer", firstName: "Junior", relationship: "Child", gender: "Male", occupation: "Student" }
    ],
    employment: [
        { type: "Current", employer: "Ministry of Finance", designation: "Senior Officer", startDate: "2020-01-01", annualSalary: 60000, currency: "SLE" }
    ],
    cashAssets: [
        { bankName: "Rokel Commercial Bank", accountNumber: "1234567890", currency: "SLE", balance: 50000, ownership: { owner: "Self" }, documents: [{name: "Statement_Jan.pdf"}] }
    ],
    immovableAssets: [
        { type: "Residential House", location: "Hill Station", currentValue: 200000, currency: "USD", acquisition: { date: "2015-06-01", cost: 150000, currency: "USD", mode: "Purchase" }, documents: [{name: "Title_Deed.pdf"}] }
    ],
    movableAssets: [
        { type: "Vehicle", description: "Toyota Prado 2018", currentValue: 15000, currency: "USD", acquisition: { date: "2019-02-01", cost: 25000, currency: "USD", mode: "Purchase" } }
    ],
    securities: [
        { companyName: "Sierra Leone Brewery", numberOfShares: 1000, currentMarketValue: 10000, currency: "SLE", documents: [{name: "Share_Cert.pdf"}] }
    ],
    otherAssets: [
        { description: "Gold Watch", value: 5000, currency: "USD" }
    ]
  },
  {
    id: "d2",
    userId: "u3",
    year: 2023,
    date: "2023-01-10",
    status: "VERIFIED",
    assets: {
      cash: 45000,
      immovable: 190000,
      movable: 15000,
      securities: 8000,
      other: 5000,
    },
    liabilities: 2000,
  },
  {
    id: "d3",
    userId: "u4",
    year: 2024,
    date: "2024-02-01",
    status: "PENDING_VERIFICATION",
    assets: {
      cash: 12000,
      immovable: 80000,
      movable: 40000,
      securities: 0,
      other: 2000,
    },
    liabilities: 15000,
  },
];

export const AUDIT_LOGS: AuditLog[] = [
    { id: "l1", action: "User Login", user: "superadmin@ads.gov", timestamp: "2024-03-12 09:45 AM", details: "Successful login from IP 192.168.1.1", status: "Success" },
    { id: "l2", action: "Declaration Verified", user: "admin@ads.gov", timestamp: "2024-03-11 02:30 PM", details: "Verified declaration D281", status: "Success" },
    { id: "l3", action: "Failed Login", user: "unknown@ip", timestamp: "2024-03-11 01:15 AM", details: "Invalid password attempts", status: "Failed" },
    { id: "l4", action: "System Config", user: "superadmin@ads.gov", timestamp: "2024-03-10 11:00 AM", details: "Updated email server settings", status: "Success" },
    { id: "l5", action: "User Created", user: "superadmin@ads.gov", timestamp: "2024-03-09 10:00 AM", details: "Created user 'Michael Director'", status: "Success" },
];

export const REPORTS: Report[] = [
    { id: "r1", title: "Monthly Compliance Report", date: "2024-02-28", type: "Compliance", status: "Ready" },
    { id: "r2", title: "Asset Value Analysis", date: "2024-03-01", type: "Verification", status: "Ready" },
    { id: "r3", title: "System Performance Log", date: "2024-03-10", type: "System", status: "Generating" },
];

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AGGREGATED_STATS = {
    complianceRate: 85,
    totalDeclarations: 12500,
    assetsDeclared: "1.2B",
    categories: [
        { name: "Real Estate", value: 45 },
        { name: "Cash Assets", value: 30 },
        { name: "Vehicles", value: 15 },
        { name: "Securities", value: 10 }
    ],
    trends: [
        { year: "2020", declarations: 8000 },
        { year: "2021", declarations: 9500 },
        { year: "2022", declarations: 11000 },
        { year: "2023", declarations: 12500 }
    ]
};

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  date: string; // ISO string
  link?: string;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    userId: "u3",
    title: "Declaration Deadline Approaching",
    message: "Your annual asset declaration for 2024 is due in 5 days.",
    type: "warning",
    read: false,
    date: "2024-03-25T10:00:00Z",
    link: "/dashboard/officer/declaration/new"
  },
  {
    id: "n2",
    userId: "u3",
    title: "Declaration Verified",
    message: "Your declaration (Ref: d2) for 2023 has been successfully verified.",
    type: "success",
    read: true,
    date: "2024-03-11T14:30:00Z",
    link: "/dashboard/officer/history/d2"
  },
   {
    id: "n3",
    userId: "u3",
    title: "System Maintenance",
    message: "The ADS portal will be down for maintenance on Saturday at 22:00.",
    type: "info",
    read: false,
    date: "2024-03-20T09:00:00Z"
  }
];
