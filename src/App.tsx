import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { useNavigationFix } from './hooks/useNavigationFix';

// Layouts
import MainLayout from './shared/layouts/MainLayout';
import AuthLayout from './shared/layouts/AuthLayout';

// Pages
import Dashboard from './features/dashboard/pages/Dashboard';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import AuthCallback from './features/auth/pages/AuthCallback';
import ReadingSession from './features/reading/pages/ReadingSession';
import Library from './features/library/pages/Library';
import Profile from './features/profile/pages/Profile';
import Settings from './features/profile/pages/Settings';
import AdminPage from './features/admin/pages/AdminPage';
import Achievements from './features/gamification/pages/Achievements';
import NotFound from './shared/pages/NotFound';

// Components
import ProtectedRoute from './shared/components/ProtectedRoute';
import ErrorBoundary from './shared/components/ErrorBoundary';

function App() {
  const { initialized } = useAuthStore();
  const { theme } = useThemeStore();
  
  // Fix mobile navigation issues
  useNavigationFix();

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="animate-pulse">
          <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        {/* Dynamic Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 to-secondary-100/30 dark:from-primary-900/30 dark:to-secondary-900/30 animate-gradient" />
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5076531/pexels-photo-5076531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-5 dark:opacity-10" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors"
          >
            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
              </Route>
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/read/:id" element={<ReadingSession />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/achievements" element={<Achievements />} />
                {import.meta.env.DEV && <Route path="/admin" element={<AdminPage />} />}
              </Route>
              
              {/* Fallback routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;