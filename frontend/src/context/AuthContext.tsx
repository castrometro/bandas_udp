// src/context/AuthContext.tsx

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axiosInstance from '../api/axios';
import { AuthState, User } from '../types';
import {getCSRFToken} from "../../utils/csrf.tsx";

type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User } }
    | { type: 'LOGIN_ERROR'; payload: string }
    | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>; // Añadimos logout al contexto
}>({ state: initialState, dispatch: () => null, checkAuth: async () => {}, logout: async () => {} });

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Función para verificar la autenticación inicial y refrescar datos
  const checkAuth = async () => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await axiosInstance.get('/api/application/current-user/');
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.data },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: 'Usuario no autenticado',
      });
    }
  };

  // Nueva función logout
  const logout = async () => {
    try {
      await axiosInstance.post('/api/application/logout/',{},{
        headers: {
          'X-CSRFToken': getCSRFToken(),
        },
      });
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error al intentar cerrar sesión:', error);
    }
  };

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    checkAuth();
  }, []);

  return (
      <AuthContext.Provider value={{ state, dispatch, checkAuth, logout }}>
        {children}
      </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
