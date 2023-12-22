import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        user: action.payload.username,
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  console.log("authprovider called!")
  const storedData = localStorage.getItem('userData');
  const retrievedData = JSON.parse(storedData);

  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: retrievedData ? true : false,
    user: retrievedData && retrievedData.username ? retrievedData.username : null,
  });


  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
