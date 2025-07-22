import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FaLock, FaUserShield, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requiredRole = null, 
  redirectTo = '/login',
  showFallback = true 
}) => {
  const { isAuthenticated, loading, hasRole, user } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Verificando acceso...</span>
          </div>
          <p className="text-muted">Verificando permisos...</p>
        </div>
      </Container>
    );
  }

  // Si requiere autenticación pero no está autenticado
  if (requireAuth && !isAuthenticated) {
    if (showFallback) {
      return (
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="text-center shadow">
                <Card.Body className="p-5">
                  <FaLock size={60} className="text-warning mb-4" />
                  <h3 className="mb-3">Acceso Restringido</h3>
                  <p className="text-muted mb-4">
                    Necesitas iniciar sesión para acceder a esta página.
                  </p>
                  <Alert variant="info" className="mb-4">
                    <strong>¿No tienes cuenta?</strong> Usa estas credenciales de prueba:
                    <br />
                    <small>
                      <strong>Usuario:</strong> usuario@talentotech.com | <strong>Contraseña:</strong> usuario123
                      <br />
                      <strong>Admin:</strong> admin@talentotech.com | <strong>Contraseña:</strong> admin123
                    </small>
                  </Alert>
                  <Button 
                    as="a" 
                    href={`#/login?redirect=${encodeURIComponent(location.pathname)}`}
                    variant="primary" 
                    size="lg"
                  >
                    <FaSignInAlt className="me-2" />
                    Iniciar Sesión
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
    
    // Redirigir con la ruta actual para volver después del login
    return <Navigate to={`${redirectTo}?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Si requiere un rol específico pero no lo tiene
  if (requiredRole && !hasRole(requiredRole)) {
    if (showFallback) {
      return (
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="text-center shadow">
                <Card.Body className="p-5">
                  <FaUserShield size={60} className="text-danger mb-4" />
                  <h3 className="mb-3">Permisos Insuficientes</h3>
                  <p className="text-muted mb-4">
                    No tienes los permisos necesarios para acceder a esta página.
                  </p>
                  <div className="mb-4">
                    <Alert variant="warning">
                      <strong>Tu rol actual:</strong> {user?.rol || 'No definido'}
                      <br />
                      <strong>Rol requerido:</strong> {requiredRole}
                    </Alert>
                  </div>
                  <Button 
                    as="a" 
                    href="#/" 
                    variant="outline-primary"
                  >
                    Volver al Inicio
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
    
    return <Navigate to="/" replace />;
  }

  // Si pasa todas las validaciones, renderizar el contenido protegido
  return children;
};

// Componente específico para rutas que requieren admin
export const AdminRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute requiredRole="admin" {...props}>
      {children}
    </ProtectedRoute>
  );
};

// Componente específico para rutas que solo requieren estar logueado
export const AuthRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute requireAuth={true} {...props}>
      {children}
    </ProtectedRoute>
  );
};

// Componente para rutas públicas (no requieren autenticación)
export const PublicRoute = ({ children, redirectIfAuthenticated = null }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  // Si está autenticado y se especifica redirección
  if (isAuthenticated && redirectIfAuthenticated) {
    return <Navigate to={redirectIfAuthenticated} replace />;
  }

  return children;
};

export default ProtectedRoute; 