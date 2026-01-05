import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.js";

// Pages
import Index from "./pages/Index.js";
import NotFound from "./pages/NotFound.js";
import Login from "./pages/auth/Login.js";
import Register from "./pages/auth/Register.js";

// Components
import { ProtectedRoute } from "./components/ProtectedRoute.js";
import { DashboardLayout } from "./components/layout/DashboardLayout.js";
import Dashboard from "./pages/dashboard/Dashboard.js";
import VacancyList from "./pages/dashboard/vacancies/VacancyList.js";
import VacancyDetail from "./pages/dashboard/vacancies/VacancyDetail.js";
import CreateVacancy from "./pages/dashboard/vacancies/CreateVacancy.js";
import EditVacancy from "./pages/dashboard/vacancies/EditVacancy.js";
import MyApplications from "./pages/dashboard/applications/MyApplications.js";
import AllApplications from "./pages/dashboard/applications/AllApplications.js";
import Users from "./pages/dashboard/Users.js";
import Settings from "./pages/dashboard/Settings.js";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* Dashboard Routes - Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="vacancies" element={<VacancyList />} />
            <Route path="vacancies/create" element={
              <ProtectedRoute requiredRoles={['ADMIN', 'GESTOR']}>
                <CreateVacancy />
              </ProtectedRoute>
            } />
            <Route path="vacancies/:id" element={<VacancyDetail />} />
            <Route path="vacancies/:id/edit" element={
              <ProtectedRoute requiredRoles={['ADMIN', 'GESTOR']}>
                <EditVacancy />
              </ProtectedRoute>
            } />
            <Route path="applications" element={<MyApplications />} />
            <Route path="applications/all" element={
              <ProtectedRoute requiredRoles={['ADMIN', 'GESTOR']}>
                <AllApplications />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
