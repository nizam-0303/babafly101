import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';
import { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAppSelector(s => s.auth);
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
