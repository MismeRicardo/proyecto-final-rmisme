import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaUser, FaUserShield } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading, isAuthenticated } = useAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    // Obtener ruta de redirección de los parámetros de URL
    const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectPath, { replace: true });
        }
    }, [isAuthenticated, navigate, redirectPath]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validación básica
        if (!formData.email || !formData.password) {
            setError('Por favor complete todos los campos');
            return;
        }

        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                // El AuthContext ya maneja localStorage, solo navegamos
                navigate(redirectPath, { replace: true });
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error inesperado. Intente nuevamente.');
        }
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="login-card shadow-lg">
                        <Card.Body className="p-5">
                            <h2 className="text-center mb-4">Iniciar Sesión</h2>
                            <p className="text-center text-muted mb-4">
                                Accede a tu cuenta de Talento Tech Store
                            </p>
                            
                            {error && <Alert variant="danger">{error}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaEnvelope />
                                        </span>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="ejemplo@correo.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Contraseña</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaLock />
                                        </span>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Tu contraseña"
                                            value={formData.password}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100 mb-4"
                                    size="lg"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Iniciando sesión...
                                        </>
                                    ) : (
                                        'Iniciar Sesión'
                                    )}
                                </Button>
                            </Form>

                            <hr className="my-4" />

                            <div className="demo-accounts">
                                <h6 className="text-center mb-3">Usuarios de Prueba</h6>
                                
                                <div className="user-credentials mb-3">
                                    <div className="d-flex align-items-center mb-2">
                                        <FaUserShield className="text-danger me-2" size={18} />
                                        <strong>Administrador</strong>
                                    </div>
                                    <div className="credential-info">
                                        <div><strong>Email:</strong> admin@talentotech.com</div>
                                        <div><strong>Contraseña:</strong> admin123</div>
                                    </div>
                                </div>

                                <div className="user-credentials mb-3">
                                    <div className="d-flex align-items-center mb-2">
                                        <FaUser className="text-primary me-2" size={18} />
                                        <strong>Usuario Normal</strong>
                                    </div>
                                    <div className="credential-info">
                                        <div><strong>Email:</strong> rmisme@gmail.com</div>
                                        <div><strong>Contraseña:</strong> 123456</div>
                                    </div>
                                </div>
                                
                                <Alert variant="info" className="mt-3">
                                    <small>
                                        <strong>Nota:</strong> Estas son cuentas de demostración para probar la aplicación.
                                        Puedes copiar y pegar las credenciales en el formulario.
                                    </small>
                                </Alert>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
} 