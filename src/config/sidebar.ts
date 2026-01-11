
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  BarChart2,
  Calendar,
  Bell,
  BookOpen,
  Settings,
  Plus,
  List,
  Edit,
  File,
  Upload,
  Download,
  HelpCircle,
  Scale,
  User,
  Briefcase,
  Lock,
  Sliders,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  Shield,
  UserPlus,
  Building2,
  Building,
  MapPin,
  UserCog,
  PieChart,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  AlertTriangle,
  Files,
  Send,
  FileSearch,
  Server,
  Layout,
  Database,
  HardDrive,
  Code,
  Mail,
  Inbox,
  ClipboardCheck,
  Filter,
  ListChecks,
  History
} from "lucide-react";

export const SIDEBAR_CONFIG = {
  PUBLIC_OFFICER: {
    header: { logo: "SL-ADS", subtitle: "Asset Declaration System" },
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/officer" },
      {
        id: "declarations",
        label: "Declarations",
        icon: FileText,
        path: "#",
        subItems: [
          { id: "new", label: "New Declaration", icon: Plus, path: "/dashboard/officer/declaration/new" },
          { id: "my-declarations", label: "My Declarations", icon: List, path: "/dashboard/officer/history" },
          { id: "drafts", label: "Drafts", icon: Edit, path: "/dashboard/officer/drafts" },
        ],
      },
      {
        id: "documents",
        label: "Documents",
        icon: FolderOpen,
        path: "#",
        subItems: [
          { id: "my-docs", label: "My Documents", icon: File, path: "/dashboard/officer/documents" },
          { id: "upload", label: "Upload Document", icon: Upload, path: "/dashboard/officer/documents/upload" },
        ],
      },
      {
        id: "calendar",
        label: "Calendar",
        icon: Calendar,
        path: "/dashboard/officer/calendar",
      },
      { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/officer/profile" },
    ],
  },
  ADS_ADMIN: {
    header: { logo: "SL-ADS", subtitle: "Admin Portal" },
    nav: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/ads-admin" },
      {
        id: "declarations",
        label: "Declarations",
        icon: FileText,
        path: "#",
        subItems: [
          { id: "all", label: "All Submissions", icon: List, path: "/dashboard/ads-admin/declarations" },
          { id: "pending", label: "Pending Review", icon: Clock, path: "/dashboard/ads-admin/declarations?status=pending" },
          { id: "approved", label: "Approved", icon: CheckCircle, path: "/dashboard/ads-admin/declarations?status=approved" },
        ],
      },
      {
        id: "reports",
        label: "Reports",
        icon: BarChart2,
        path: "/dashboard/ads-admin/reports",
      },
      { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/ads-admin/profile" },
    ],
  },
  SUPER_ADMIN: {
    header: { logo: "SL-ADS", subtitle: "Super Admin Console" },
    nav: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/super-admin" },
        {
          id: "users",
          label: "Users",
          icon: Users,
          path: "#",
          subItems: [
            { id: "all", label: "All Users", icon: List, path: "/dashboard/super-admin/users" },
            { id: "admins", label: "Administrators", icon: Shield, path: "/dashboard/super-admin/users/admins" },
          ]
        },
        { id: "audit", label: "Audit Logs", icon: FileSearch, path: "/dashboard/super-admin/audit-logs" },
        { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/super-admin/settings" },
    ]
  },
  VERIFIER: {
    header: { logo: "SL-ADS", subtitle: "Verifier Portal" },
    nav: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/verifier" },
        {
          id: "assignments",
          label: "My Assignments",
          icon: ClipboardCheck,
          path: "#",
          subItems: [
            { id: "pending", label: "Pending Review", icon: Clock, path: "/dashboard/verifier/assignments/pending" },
            { id: "completed", label: "Completed", icon: CheckCircle, path: "/dashboard/verifier/assignments/completed" },
          ]
        },
        { 
            id: "verification", 
            label: "Verification Tools", 
            icon: ListChecks, 
            path: "/dashboard/verifier/tools" 
        },
        { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/verifier/profile" },
    ]
  },
  PUBLIC_USER: {
      header: { logo: "SL-ADS", subtitle: "Citizen Portal" },
      nav: [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/public" },
          { id: "inquiries", label: "Inquiries", icon: HelpCircle, path: "/dashboard/public/inquiries" },
          { id: "profile", label: "Profile", icon: User, path: "/dashboard/public/profile" },
      ]
  }
};
