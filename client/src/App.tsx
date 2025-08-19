import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MembershipPage from "./pages/MembershipPage";
import BookingPage from "./pages/BookingPage";
import InsurancePage from "./pages/InsurancePage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import NotFound from "./pages/NotFound";
import HealthHubClinicServices from "./components/Clinics";
import MediCoConsultationForm from "./components/ConsultationForm";
import UserRegister from "./pages/UserReg";
import UserLogin from "./pages/UserLog";
import ClinicRegister from "./pages/ClinicReg";
import ClinicLogin from "./pages/ClinicLog";
import AdminRegister from "./pages/AdminReg";
import AdminLogin from "./pages/AdminLog";
import AdminDashboard from "./pages/AdminDashboard";
import ClinicVerificationAdmin from "./pages/AdminClinicVerification";
import ClinicDashboard from "./pages/ClinicDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import EntityDashboard from "./pages/PharmacylabDash";
import PendingApproval from "./pages/PendingApproval";
import UserForgotPassword from "./pages/UserForgotPassword";
import ClinicForgotPassword from "./pages/ClinicForgotPassword";
import RoleProtectedRoute from "./ProtectedRoute";
const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
          <Route path="/clinicmain" element={  <RoleProtectedRoute allowedRoles={["300"]}><HealthHubClinicServices /></RoleProtectedRoute>} />
          <Route path="/consultform" element={<MediCoConsultationForm />} />
          <Route path="/userreg" element={<UserRegister />} />
          <Route path="/userlog" element={<UserLogin />} />
          <Route path="/clinicreg" element={<ClinicRegister />} />
          <Route path="/cliniclog" element={<ClinicLogin />} />
          <Route path="/adminreg" element={<AdminRegister />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admindash" element={ <RoleProtectedRoute allowedRoles={["500"]}><AdminDashboard /></RoleProtectedRoute>} />
          <Route path="/verifyclinic" element={<ClinicVerificationAdmin />} />
          <Route path="/clinicdash" element={<RoleProtectedRoute allowedRoles={["400"]}><ClinicDashboard /></RoleProtectedRoute>} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/entitydash" element={<EntityDashboard />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/user/forgot-password" element={<UserForgotPassword />} />
          <Route path="/clinic/forgot-password" element={<ClinicForgotPassword />} />



          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
