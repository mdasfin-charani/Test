import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/layouts/SuperAdminLayout.jsx';
import { Loader2 } from 'lucide-react';
import Footer from '@/components/global/hub-admin/Footer';
import { useTheme } from '@/context/super-admin/ThemeContext';

// Lazy-loaded pages for performance
const Login        = lazy(() => import('@/pages/super-admin/Login.jsx'));
const Statistics   = lazy(() => import('@/pages/super-admin/Statistics.jsx'));
const Profile      = lazy(() => import('@/pages/super-admin/Profile.jsx'));
const Settings     = lazy(() => import('@/pages/super-admin/Settings.jsx'));
const HelpCenter   = lazy(() => import('@/pages/super-admin/HelpCenter.jsx'));
const Logout       = lazy(() => import('@/pages/super-admin/Logout.jsx'));
const SuperAdminDashboard = lazy(() => import('@/pages/super-admin/SuperAdminDashboard.jsx'));
const CreateAdmin  = lazy(() => import('@/pages/super-admin/CreateAdmin.jsx'));
const CreateSuperAdmin = lazy(() => import('@/pages/super-admin/CreateSuperAdmin.jsx'));

// Loading spinner fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 size={36} className="animate-spin text-blue-500" />
      <p className="text-sm font-semibold text-slate-400">Loading page...</p>
    </div>
  </div>
);

const wrap = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes without Sidebar */}
      <Route path="/login" element={wrap(Login)} />

      {/* All routes nested inside Layout – renders Sidebar + Navbar for every page */}
      <Route element={<Layout />}>
        {/* Default redirect to Login */}
        <Route index element={<Navigate to="/login" replace />} />

        {/* Main pages */}
        <Route path="/super-admin-dashboard" element={wrap(SuperAdminDashboard)} />
        <Route path="/statistics"   element={wrap(Statistics)} />
        <Route path="/create-admin" element={wrap(CreateAdmin)} />
        <Route path="/create-super-admin" element={wrap(CreateSuperAdmin)} />

        {/* Account pages */}
        <Route path="/profile"  element={wrap(Profile)} />
        <Route path="/settings" element={wrap(Settings)} />
        <Route path="/help"     element={wrap(HelpCenter)} />
        <Route path="/logout"   element={wrap(Logout)} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
