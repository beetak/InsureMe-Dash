import { lazy } from "react"

// Lazy load components
const Sales = lazy(() => import("../pages/salesPage/Sales"))
const Products = lazy(() => import("../pages/productsPage/Products"))
const LoginPage = lazy(() => import("../pages/login/LoginPage"))
const OrganisationalEntities = lazy(() => import("../pages/organisationalEntities/OrganisationalEntities"))
const Insurers = lazy(() => import("../pages/insurerPage/Insurer"))
const InternalUsers = lazy(() => import("../pages/userManagement/InternalUsers"))
const InsurerUsers = lazy(() => import("../pages/userManagement/InsurerUsers"))
const Customers = lazy(() => import("../pages/userManagement/Customers"))
const NotFound = lazy(() => import("../pages/errorPages/NotFound"))
const RegionsPage = lazy(() => import("../pages/entityManagement/RegionsPage"))
const TownsPage = lazy(() => import("../pages/entityManagement/TownsPage"))
const ShopsPage = lazy(() => import("../pages/entityManagement/ShopsPage"))
const Insurance = lazy(() => import("../pages/productManagement/Insurance"))
const InsuranceCategory = lazy(() => import("../pages/insuranceCategory/InsuranceCategory"))
const Dashboard = lazy(() => import("../pages/homePage/Dashboard"))
const RolesPage = lazy(() => import("../pages/entityManagement/RolesPage"))
const Forbidden = lazy(() => import("../pages/errorPages/Forbidden"))
const AccountManagement = lazy(() => import("../pages/userManagement/AccountManagement"))
const Reports = lazy(() => import("../pages/reports/Reports"))
const Policy = lazy(() => import("../pages/Policy/Policy"))
const Covernotes = lazy(() => import("../pages/covernotes/Covernotes"))
const Claims = lazy(() => import("../pages/claims/Claims"))

export const routes = [
  // Public Routes
  { path: "login", element: LoginPage, roles: [] },
  { path: "unauthorized", element: Forbidden, roles: [] },

  // Protected Routes for All Users
  { path: "insurance", element: Insurance, roles: ["SUPER_ADMINISTRATOR", "SALES_AGENT", "ADMIN", "INSURER_ADMIN"] },
  {
    path: "insurance-type",
    element: InsuranceCategory,
    roles: ["SUPER_ADMINISTRATOR", "SALES_AGENT", "ADMIN", "INSURER_ADMIN"],
  },
  {
    path: "profile",
    element: AccountManagement,
    roles: ["SUPER_ADMINISTRATOR", "SALES_AGENT", "ADMIN", "INSURER_ADMIN"],
  },
  { path: "reports", element: Reports, roles: ["SUPER_ADMINISTRATOR", "SALES_AGENT", "ADMIN", "INSURER_ADMIN"] },
  { path: "policy", element: Policy, roles: ["SUPER_ADMINISTRATOR", "SALES_AGENT", "ADMIN", "INSURER_ADMIN"] },

  // Protected Routes for Super Admin, Insurer Admin, and System Admin
  { path: "insurer-users", element: InsurerUsers, roles: ["SUPER_ADMINISTRATOR", "ADMIN", "INSURER_ADMIN"] },
  { path: "dashboard", element: Dashboard, roles: ["SUPER_ADMINISTRATOR", "ADMIN", "INSURER_ADMIN"] },
  { path: "products", element: Products, roles: ["SUPER_ADMINISTRATOR", "ADMIN", "INSURER_ADMIN"] },
  { path: "claims", element: Claims, roles: ["SUPER_ADMINISTRATOR", "ADMIN", "INSURER_ADMIN"] },
  { path: "notes", element: Covernotes, roles: ["SUPER_ADMINISTRATOR", "ADMIN", "INSURER_ADMIN"] },

  // Protected Routes for Super Admin and System Admin
  { path: "organisational-entities", element: OrganisationalEntities, roles: ["SUPER_ADMINISTRATOR", "ADMIN"] },
  { path: "internal-users", element: InternalUsers, roles: ["SUPER_ADMINISTRATOR", "ADMIN"] },
  { path: "customers", element: Customers, roles: ["SUPER_ADMINISTRATOR", "ADMIN"] },
  { path: "regions", element: RegionsPage, roles: ["SUPER_ADMINISTRATOR", "ADMIN"] },
  { path: "towns", element: TownsPage, roles: ["SUPER_ADMINISTRATOR", "ADMIN"] },
  { path: "shops", element: ShopsPage, roles: ["SUPER_ADMINISTRATOR", "ADMIN"] },
  { path: "roles", element: RolesPage, roles: ["SUPER_ADMINISTRATOR", "ADMIN"] },
  { path: "insurers", element: Insurers, roles: ["SUPER_ADMINISTRATOR", "ADMIN"] },

  // Protected Routes for Sales Agent
  { path: "sales", element: Sales, roles: ["SALES_AGENT"] },

  // Catch-all Route
  { path: "*", element: NotFound, roles: [] },
]

