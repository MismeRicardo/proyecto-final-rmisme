import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const AuthContext = createContext();

const ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  SET_LOADING: 'SET_LOADING'
};

// Reducer para manejar el estado de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false
      };
    
    case ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false
      };
    
    case ACTIONS.LOAD_USER:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        loading: false
      };
    
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    default:
      return state;
  }
};

// Estado inicial
const estadoInicial = {
  isAuthenticated: false,
  user: null,
  loading: true
};

const usuariosPrueba = [
  {
    id: 1,
    email: 'admin@talentotech.com',
    password: 'admin123',
    nombre: 'Administrador',
    apellido: 'Sistema',
    rol: 'admin'
  },
  {
    id: 2,
    email: 'rmisme@gmail.com',
    password: '123456',
    nombre: 'Ricardo',
    apellido: 'Misme',
    rol: 'usuario'
  }
];

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, estadoInicial);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadAuthState = () => {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userData = localStorage.getItem('userData');
        
        if (isAuthenticated && userData) {
          const user = JSON.parse(userData);
          dispatch({
            type: ACTIONS.LOAD_USER,
            payload: { isAuthenticated: true, user }
          });
        } else {
          dispatch({
            type: ACTIONS.LOAD_USER,
            payload: { isAuthenticated: false, user: null }
          });
        }
      } catch (error) {
        console.error('Error al cargar estado de autenticación:', error);
        dispatch({
          type: ACTIONS.LOAD_USER,
          payload: { isAuthenticated: false, user: null }
        });
      }
      setIsLoaded(true);
    };

    loadAuthState();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('isAuthenticated', state.isAuthenticated.toString());
      if (state.user) {
        localStorage.setItem('userData', JSON.stringify(state.user));
      } else {
        localStorage.removeItem('userData');
      }
    }
  }, [state.isAuthenticated, state.user, isLoaded]);

  const login = async (email, password) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usuario = usuariosPrueba.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (usuario) {
        const { password: _, ...userWithoutPassword } = usuario;
        
        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: { user: userWithoutPassword }
        });
        
        return { success: true, user: userWithoutPassword };
      } else {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return { 
          success: false, 
          error: 'Credenciales inválidas. Verifique su email y contraseña.' 
        };
      }
    } catch (error) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return { 
        success: false, 
        error: 'Error en el servidor. Intente nuevamente.' 
      };
    }
  };

  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('carrito');
  };

  const hasRole = (role) => {
    return state.user && state.user.rol === role;
  };

  const isAuthorized = (requiredRole = null) => {
    if (!state.isAuthenticated) return false;
    if (requiredRole && !hasRole(requiredRole)) return false;
    return true;
  };

  const getCurrentUser = () => {
    return state.user;
  };

  const value = {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    loading: state.loading,
    
    login,
    logout,
    hasRole,
    isAuthorized,
    getCurrentUser,
    
    isAdmin: hasRole('admin'),
    isUser: hasRole('usuario'),
    userName: state.user ? `${state.user.nombre} ${state.user.apellido}` : null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthLoading = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  return children;
};

export default AuthContext; 