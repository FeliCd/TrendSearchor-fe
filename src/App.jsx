import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';
import RootLayout from '@/components/layout/RootLayout';
import ProtectedRoute from '@/components/protected/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ROLES } from '@/constants/roles';

const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));

const AdminLayout = lazy(() => import('@/components/admin/layout/AdminLayout'));
const LecturerLayout = lazy(() => import('@/components/lecturer/layout/LecturerLayout'));
const StudentLayout = lazy(() => import('@/components/student/layout/StudentLayout'));
const ResearcherLayout = lazy(() => import('@/components/researcher/layout/ResearcherLayout'));
const UserLayout = lazy(() => import('@/components/user/layout/UserLayout'));

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage'));
const AdminTrendsPage = lazy(() => import('@/pages/admin/AdminTrendsPage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'));
const LecturerDashboardPage = lazy(() => import('@/pages/lecturer/LecturerDashboardPage'));
const StudentDashboardPage = lazy(() => import('@/pages/student/StudentDashboardPage'));
const ResearcherDashboardPage = lazy(() => import('@/pages/researcher/ResearcherDashboardPage'));
const UserDashboardPage = lazy(() => import('@/pages/user/UserDashboardPage'));
const PaperSearchPage = lazy(() => import('@/pages/researcher/PaperSearchPage'));
const TrendsPage = lazy(() => import('@/pages/researcher/TrendsPage'));
const BookmarksPage = lazy(() => import('@/pages/user/BookmarksPage'));
const NotificationsPage = lazy(() => import('@/pages/user/NotificationsPage'));
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
  return (
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
            <Route path="/admin" element={<AdminDashboardPage />} end />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/trends" element={<AdminTrendsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
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
            <Route path="/researcher/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ─── LECTURER routes ─── */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.LECTURER]} />}>
          <Route element={<Suspense fallback={<PageLoader />}><LecturerLayout /></Suspense>}>
            <Route path="/lecturer" element={<LecturerDashboardPage />} end />
            <Route path="/lecturer/search" element={<PaperSearchPage />} />
            <Route path="/lecturer/trends" element={<TrendsPage />} />
            <Route path="/lecturer/bookmarks" element={<BookmarksPage />} />
            <Route path="/lecturer/notifications" element={<NotificationsPage />} />
            <Route path="/lecturer/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ─── STUDENT routes ─── */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
          <Route element={<Suspense fallback={<PageLoader />}><StudentLayout /></Suspense>}>
            <Route path="/student" element={<StudentDashboardPage />} end />
            <Route path="/student/search" element={<PaperSearchPage />} />
            <Route path="/student/trends" element={<TrendsPage />} />
            <Route path="/student/bookmarks" element={<BookmarksPage />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
            <Route path="/student/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ─── USER routes ─── */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
          <Route element={<Suspense fallback={<PageLoader />}><UserLayout /></Suspense>}>
            <Route path="/user" element={<UserDashboardPage />} end />
            <Route path="/user/search" element={<PaperSearchPage />} />
            <Route path="/user/trends" element={<TrendsPage />} />
            <Route path="/user/bookmarks" element={<BookmarksPage />} />
            <Route path="/user/notifications" element={<NotificationsPage />} />
            <Route path="/user/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
