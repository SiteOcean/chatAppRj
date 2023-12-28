// PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authContextJs';
import LoginPage from '../components/loginPage';

const LoginPrivateRoute = ({children}) => {
  const { state } = useAuth();

  return state.isAuthenticated ? (
    <>{children}</>
  ) : (
    <LoginPage/>
  );
};

export default LoginPrivateRoute;
