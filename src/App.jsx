import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HubLogin from '@/pages/auth/HubLogin.jsx';
import HubForm from '@/pages/auth/HubForm.jsx';
import StoreLogin from '@/pages/auth/StoreLogin.jsx';
import StoreDashboard from '@/pages/auth/StoreDashboard.jsx';
import StoreForm from '@/pages/auth/StoreForm.jsx';
import HubSignup from '@/pages/auth/HubSignup.jsx';
import StoreSignup from '@/pages/auth/StoreSignup.jsx';
import ResetPassword from '@/pages/auth/ResetPassword.jsx';
import Navbar from "@/layouts/MainNavbar.jsx";
import '@/App.css';

// Super Admin Layout
import SuperAdminWrapper from "@/layouts/SuperAdminLayout.jsx";
import SuperAdminDashboard from '@/pages/super-admin/SuperAdminDashboard.jsx';
import Statistics from '@/pages/super-admin/Statistics';
import Profile from '@/pages/super-admin/Profile';
import Settings from '@/pages/super-admin/Settings';
import CreateAdmin from '@/pages/auth/HubSignup';
import CreateSuperAdmin from '@/pages/super-admin/CreateSuperAdmin.jsx';
import Login from '@/pages/super-admin/Login';
import Logout from '@/pages/super-admin/Logout';
import HelpCenter from '@/pages/super-admin/HelpCenter';
import { Navigate } from "react-router-dom";
import { ThemeProvider } from '@/context/super-admin/ThemeContext';

import HubAdminRoutes from '@/routes/hub-admin/AppRoutes';
import { ThemeProvider as HubThemeProvider } from '@/context/hub-admin/ThemeContext';
import { ReviewsProvider as HubReviewsProvider } from '@/context/hub-admin/ReviewsContext';
import { ProfileProvider as HubProfileProvider } from '@/context/hub-admin/ProfileContext';

import StoreAdminRoutesV2 from '@/routes/store-admin/AppRoutes';
import { ThemeProvider as StoreThemeProvider } from '@/context/store-admin/ThemeContext';
import { ReviewsProvider as StoreReviewsProvider } from '@/context/store-admin/ReviewsContext';
import { ProfileProvider as StoreProfileProvider } from '@/context/store-admin/ProfileContext';

function App() {
  const location = useLocation();
  const superAdminRoutes = ['/', '/dashboard', '/statistics', '/profile', '/settings', '/create-admin', '/create-super-admin', '/help', '/logout'];
  const isSuperAdminRoute = superAdminRoutes.includes(location.pathname);
  const isAuthenticated = localStorage.getItem('superAdminAuth') === 'true';

  if (location.pathname.startsWith('/hub-dashboard')) {
    return (
      <HubThemeProvider>
        <HubReviewsProvider>
          <HubProfileProvider>
            <Routes>
              <Route path="/hub-dashboard/*" element={<HubAdminRoutes />} />
            </Routes>
          </HubProfileProvider>
        </HubReviewsProvider>
      </HubThemeProvider>
    );
  }

  if (location.pathname.startsWith('/store-dashboard')) {
    return (
      <StoreThemeProvider>
        <StoreReviewsProvider>
          <StoreProfileProvider>
            <Routes>
              <Route path="/store-dashboard/*" element={<StoreAdminRoutesV2 />} />
            </Routes>
          </StoreProfileProvider>
        </StoreReviewsProvider>
      </StoreThemeProvider>
    );
  }

  if (location.pathname === '/login') {
    return (
      <ThemeProvider>
        <Routes>
          // This check now ensures session-aware redirection
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        </Routes>
      </ThemeProvider>
    );
  }

   if (isSuperAdminRoute) {
     return (
       <ThemeProvider>
         <Routes>
            // This check now ensures session-aware redirection
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route element={<SuperAdminWrapper />}>
               <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
               <Route path="/dashboard" element={isAuthenticated ? <SuperAdminDashboard /> : <Navigate to="/login" />} />
           <Route path="/statistics" element={isAuthenticated ? <Statistics /> : <Navigate to="/login" />} />
           <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
           <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
           <Route path="/create-admin" element={isAuthenticated ? <HubSignup /> : <Navigate to="/login" />} />
           <Route path="/create-super-admin" element={isAuthenticated ? <CreateSuperAdmin /> : <Navigate to="/login" />} />
           <Route path="/help" element={isAuthenticated ? <HelpCenter /> : <Navigate to="/login" />} />
           <Route path="/logout" element={isAuthenticated ? <Logout /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </ThemeProvider>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/hub-login" element={<HubLogin />} />
            <Route path="/hub" element={<HubForm />} />
            <Route path="/store-login" element={<StoreLogin />} />
            <Route path="/store-dashboard" element={<StoreDashboard />} />
            <Route path="/store" element={<StoreForm />} />
            <Route path="/hub-signup" element={<HubSignup />} />
            <Route path="/store-signup" element={<StoreSignup />} />
            <Route path="/store-admin" element={<div className="text-center py-20"><h1 className="text-3xl font-bold">Store Admin Panel</h1><p className="text-gray-500 mt-4">Coming Soon</p></div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
