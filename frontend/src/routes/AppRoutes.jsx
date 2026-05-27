import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingScreen from '../components/ui/LoadingScreen';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Lazy-loaded pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const FeaturesPage = lazy(() => import('../pages/FeaturesPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));

const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));

const UserDashboard = lazy(() => import('../pages/UserDashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const BillUploadPage = lazy(() => import('../pages/BillUploadPage'));
const SolarCalculatorPage = lazy(() => import('../pages/SolarCalculatorPage'));
const EnergyAnalyticsPage = lazy(() => import('../pages/EnergyAnalyticsPage'));
const RooftopAnalysisPage = lazy(() => import('../pages/RooftopAnalysisPage'));
const AIChatPage = lazy(() => import('../pages/AIChatPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Dashboard Routes (Protected) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/analytics" element={<EnergyAnalyticsPage />} />
          <Route path="/dashboard/calculator" element={<SolarCalculatorPage />} />
          <Route path="/dashboard/bill-upload" element={<BillUploadPage />} />
          <Route path="/dashboard/rooftop" element={<RooftopAnalysisPage />} />
          <Route path="/dashboard/ai-chat" element={<AIChatPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Routes (Protected + Admin Only) */}
        <Route
          element={
            <ProtectedRoute adminOnly>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Suspense>
  );
}
