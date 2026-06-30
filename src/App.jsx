import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';
import RootLayout from '@/components/layout/RootLayout';
import ProtectedRoute from '@/components/protected/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import { ROLES } from '@/constants/roles';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));

const AdminLayout = lazy(() => import('@/components/admin/layout/AdminLayout'));
const AcademicLayout = lazy(() => import('@/components/academic/layout/AcademicLayout'));
const ResearcherLayout = lazy(() => import('@/components/researcher/layout/ResearcherLayout'));

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage'));
const PaperModerationPage = lazy(() => import('@/pages/admin/PaperModerationPage'));
const AcademicDashboardPage = lazy(() => import('@/pages/academic/AcademicDashboardPage'));
const ResearcherDashboardPage = lazy(() => import('@/pages/researcher/ResearcherDashboardPage'));
const PaperSearchPage = lazy(() => import('@/pages/researcher/PaperSearchPage'));
const TrendsPage = lazy(() => import('@/pages/researcher/TrendsPage'));
const PaperUploadPage = lazy(() => import('@/pages/researcher/PaperUploadPage'));
const BookmarksPage = lazy(() => import('@/pages/shared/BookmarksPage'));
const NotificationsPage = lazy(() => import('@/pages/shared/NotificationsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#010409]">
      <LoadingSpinner />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  return (
    <>
      <ChangePasswordModal
        isOpen={user?.mustChangePassword === true}
        user={user}
        onSuccess={refreshUser}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<RootLayout />}>
            <Route
              path="/"
              element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>}
            />
            <Route
              path="*"
              element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>}
            />
          </Route>

          <Route
            path="/login"
            element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>}
          />
          <Route
            path="/register"
            element={<Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>}
          />
          <Route
            path="/forgot-password"
            element={<Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense>}
          />

          {/* ─── ADMIN routes ─── */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route element={<Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>}>
              <Route path="/admin" element={<Navigate to="/admin/users" replace />} end />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/papers/pending" element={<PaperModerationPage />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ─── RESEARCHER routes ─── */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.RESEARCHER]} />}>
            <Route element={<Suspense fallback={<PageLoader />}><ResearcherLayout /></Suspense>}>
              <Route path="/researcher" element={<ResearcherDashboardPage />} end />
              <Route path="/researcher/search" element={<PaperSearchPage />} />
              <Route path="/researcher/trends" element={<TrendsPage />} />
              <Route path="/researcher/analytics" element={<ResearcherDashboardPage />} />
              <Route path="/researcher/bookmarks" element={<BookmarksPage />} />
              <Route path="/researcher/upload" element={<PaperUploadPage />} />
              <Route path="/researcher/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ─── ACADEMIC (LECTURER / STUDENT) routes ─── */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.LECTURER, ROLES.STUDENT]} />}>
            <Route element={<Suspense fallback={<PageLoader />}><AcademicLayout /></Suspense>}>
              <Route path="/academic" element={<AcademicDashboardPage />} end />
              <Route path="/academic/search" element={<PaperSearchPage />} />
              <Route path="/academic/trends" element={<TrendsPage />} />
              <Route path="/academic/bookmarks" element={<BookmarksPage />} />
              <Route path="/academic/notifications" element={<NotificationsPage />} />
              <Route path="/academic/profile" element={<ProfilePage />} />
            </Route>
          </Route>

        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
