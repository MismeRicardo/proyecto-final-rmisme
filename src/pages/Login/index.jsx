import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import usuarioPrueba from '../../utils/UsuarioPrueba.json';
import './styles.css';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (error) setError('');
    };

    const validarCredenciales = (email, password) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('El formato del email no es válido');
        }

        if (email !== usuarioPrueba.email || password !== usuarioPrueba.password) {
            throw new Error('Email o contraseña incorrectos');
        }

        return {
            isAuthenticated: true,
            userData: {
                id: usuarioPrueba.id,
                nombre: usuarioPrueba.name,
                email: usuarioPrueba.email,
                rol: usuarioPrueba.role,
                avatar: usuarioPrueba.avatar
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const resultado = validarCredenciales(formData.email, formData.password);

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userData', JSON.stringify(resultado.userData));

            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="login-container">
            <Card className="login-card">
                <Card.Body>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaEnvelope />
                                </span>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaLock />
                                </span>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>

                        <div className="text-center">
                            <p className="mb-0">Credenciales de prueba:</p>
                            <small className="text-muted">
                                Email: {usuarioPrueba.email}<br/>
                                Contraseña: {usuarioPrueba.password}
                            </small>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
} 