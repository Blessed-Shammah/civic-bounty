// src/components/auth/ProtectedRoute.jsx
import { useUser } from '@civic/auth/react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}