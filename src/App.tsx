import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import { FoodProvider } from "@/context/FoodContext";

// --- Existing Imports ---
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import DoctorLayout from "./components/layout/DoctorLayout";
import PatientLayout from "./components/layout/PatientLayout";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";
import MealLogging from "./pages/patient/MealLogging";
import SymptomTracking from "./pages/patient/SymptomTracking";
import LifestyleTracker from "./pages/patient/LifestyleTracker";
import SocialSupport from "./pages/patient/SocialSupport";
import AddPatient from "./pages/doctor/AddPatient";
import Patients from "./pages/doctor/Patients";
import AppointmentScheduler from "./pages/doctor/AppointmentScheduler";
import PatientAlerts from "./pages/doctor/PatientAlerts";
import CommunicationPortal from "./pages/doctor/CommunicationPortal";
import PatientFeedback from "./pages/doctor/PatientFeedback";
import TeamManagement from "./pages/doctor/TeamManagement";
import FoodExplorer from "./pages/doctor/FoodExplorer";
import RecipeBuilder from "./pages/doctor/RecipeBuilder";
import DietChart from "./pages/doctor/DietChart";
import NotFound from "./pages/NotFound";
import Questionnaire from "./pages/patient/Questionnaire";
import PatientProfile from "./pages/patient/PatientProfile";
import Reminders from "./pages/patient/Reminders";
import Settings from "./pages/patient/Settings";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import ConsultDoctor from "./components/ConsultDoctor";

// --- Neuvia Imports ---
import Community from "./pages/neuvia/Community";
import ConsultDoctorN from "./pages/neuvia/ConsultDoctor";
import NeuviaDashboard from "./pages/neuvia/Dashboard";
import DietPlan from "./pages/neuvia/DietPlan";
import DoctorDashboardN from "./pages/neuvia/DoctorDashboard";
import EmergencyAlert from "./pages/neuvia/EmergencyAlert";
import FamilyAlerts from "./pages/neuvia/FamilyAlerts";
import FeedbackForm from "./pages/neuvia/FeedbackForm";
import HealthDetails from "./pages/neuvia/HealthDetails";
import LoginN from "./pages/neuvia/Login";
import MedicalRecord from "./pages/neuvia/MedicalRecord";
import MedicineReminder from "./pages/neuvia/MedicineReminder";
import PersonalizedDietPlan from "./pages/neuvia/PersonalizedDietPlan";
import PregnancyChatbot from "./pages/neuvia/PregnancyChatbot";
import ProfilePage from "./pages/neuvia/ProfilePage";
import ResultsPage from "./pages/neuvia/ResultsPage";
import Signup from "./pages/neuvia/Signup";
import SymptomTracker from "./pages/neuvia/SymptomTracker";
import UltrasoundTracker from "./pages/neuvia/UltrasoundTracker";
import WeeklyTrends from "./pages/neuvia/WeeklyTrends";
import NotFoundN from "./pages/neuvia/NotFound";

// --- Query Client ---
const queryClient = new QueryClient();

// --- Loading Component ---
const LoadingScreen = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </div>
  </div>
);

// --- Protected Routes ---
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "doctor" | "patient";
}) => {
  const { user, isLoading } = useApp();

  if (isLoading) return <LoadingScreen message="Verifying authentication..." />;
  if (!user) return <Navigate to="/" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;

  return <>{children}</>;
};

// --- Patient Protected Route ---
const PatientProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, questionnaireCompleted, isLoading } = useApp();

  if (isLoading) return <LoadingScreen message="Loading your profile..." />;

  if (!user || user.role !== "patient") return <Navigate to="/" replace />;

  // Redirect if questionnaire is not completed or field is missing
  if (questionnaireCompleted === false || questionnaireCompleted === null || questionnaireCompleted === undefined)
    return <Navigate to="/patient/questionnaire" replace />;

  return <>{children}</>;
};


// --- Auth Redirect ---
const AuthRedirect = () => {
  const { user, questionnaireCompleted, isLoading } = useApp();

  if (isLoading) return <LoadingScreen message="Setting up your dashboard..." />;
  if (!user) return <Navigate to="/" replace />;
  if (user.role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
  if (user.role === "patient") {
    if (questionnaireCompleted === false || questionnaireCompleted === null)
      return <Navigate to="/patient/questionnaire" replace />;
    return <Navigate to="/patient/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
};

// --- App Routes ---
const AppRoutes = () => (
  <Routes>
    {/* Landing / Auth */}
    <Route path="/" element={<Landing />} />
    <Route path="/auth/:role" element={<Login />} />
    <Route path="/redirect" element={<AuthRedirect />} />

    {/* Doctor Routes */}
    <Route
      path="/doctor"
      element={
        <ProtectedRoute requiredRole="doctor">
          <DoctorLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<DoctorDashboard />} />
      <Route path="patients" element={<Patients />} />
      <Route path="add-patient" element={<AddPatient />} />
      <Route path="appointments" element={<AppointmentScheduler />} />
      <Route path="alerts" element={<PatientAlerts />} />
      <Route path="communication" element={<CommunicationPortal />} />
      <Route path="feedback" element={<PatientFeedback />} />
      <Route path="team" element={<TeamManagement />} />
      <Route path="food-explorer" element={<FoodExplorer />} />
      <Route path="recipes" element={<RecipeBuilder />} />
      <Route path="diet-charts" element={<DietChart />} />
      <Route path="profile" element={<DoctorProfile />} />
      <Route path="consult-doctor" element={<ConsultDoctor />} />
      <Route path="settings" element={<div className="p-6">Settings - Coming Soon</div>} />
      <Route index element={<Navigate to="/doctor/dashboard" replace />} />
    </Route>

    {/* Patient Routes */}
    <Route path="/patient">
      <Route
        path="questionnaire"
        element={
          <ProtectedRoute requiredRole="patient">
            <Questionnaire />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <PatientProtectedRoute>
            <Outlet />
          </PatientProtectedRoute>
        }
      >
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="meal-logging" element={<MealLogging />} />
        <Route path="lifestyle-tracker" element={<LifestyleTracker />} />
        <Route path="social-support" element={<SocialSupport />} />
        <Route path="consult-doctor" element={<ConsultDoctor />} />
        <Route path="appointments" element={<AppointmentScheduler />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="settings" element={<Settings />} />
        <Route index element={<Navigate to="/patient/dashboard" replace />} />
      </Route>
    </Route>

    {/* Neuvia Routes */}
    <Route path="/dashboard" element={<NeuviaDashboard />} />
    <Route path="/community" element={<Community />} />
    <Route path="/consult-doctor" element={<ConsultDoctorN />} />
    <Route path="/diet-plan" element={<DietPlan />} />
    <Route path="/doctor-dashboard" element={<DoctorDashboardN />} />
    <Route path="/emergency-alert" element={<EmergencyAlert />} />
    <Route path="/family-alerts" element={<FamilyAlerts />} />
    <Route path="/feedback" element={<FeedbackForm />} />
    <Route path="/health-details" element={<HealthDetails />} />
    <Route path="/login" element={<LoginN />} />
    <Route path="/medical-record" element={<MedicalRecord />} />
    <Route path="/medicine-reminder" element={<MedicineReminder />} />
    <Route path="/premium" element={<PersonalizedDietPlan />} />
    <Route path="/pregnancy-chatbot" element={<PregnancyChatbot />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/results" element={<ResultsPage />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/symptom-tracker" element={<SymptomTracker />} />
    <Route path="/ultrasound-tracker" element={<UltrasoundTracker />} />
    <Route path="/weekly-trends" element={<WeeklyTrends />} />
    <Route path="*" element={<NotFoundN />} />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// --- Main App ---
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <FoodProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </FoodProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
