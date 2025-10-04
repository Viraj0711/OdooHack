import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Import components directly to avoid chunk loading issues
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Import expense components
import Expenses from './pages/Expenses';
import ExpenseForm from './pages/ExpenseForm';
import ExpenseDetail from './pages/ExpenseDetail';
import OfficeSuppliesExpense from './pages/OfficeSuppliesExpense';

// Import placeholder components
import { 
  Profile, 
  Approvals, 
  Users, 
  Company, 
  Workflows, 
  Analytics,
  Reports,
  Settings 
} from './pages/PlaceholderPages';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffffff]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Expense routes */}
            <Route path="expenses" element={<Expenses />} />
            <Route path="expenses/new" element={<ExpenseForm />} />
            <Route path="expenses/:id" element={<ExpenseDetail />} />
            <Route path="expenses/:id/edit" element={<ExpenseForm />} />
            <Route path="expenses/office-supplies" element={<OfficeSuppliesExpense />} />

            {/* Approval routes (Manager/Admin only) */}
            <Route
              path="approvals"
              element={
                <ProtectedRoute allowedRoles={['manager', 'admin']}>
                  <Approvals />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/company"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Company />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/workflows"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Workflows />
                </ProtectedRoute>
              }
            />

            {/* Analytics routes (Admin/Manager only) */}
            <Route
              path="analytics"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;