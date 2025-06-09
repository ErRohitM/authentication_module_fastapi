import React from 'react';
import { useRecoilValue } from 'recoil';
import { isAuthenticatedSelector } from '../recoil/auth.atom';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
