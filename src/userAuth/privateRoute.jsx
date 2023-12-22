// PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authContextJs';

const PrivateRoute = ({children}) => {
  const { state } = useAuth();

  return state.isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
