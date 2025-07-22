import React from 'react';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignInAlt, FaSignOutAlt, FaTachometerAlt, FaCog } from 'react-icons/fa';
import { useCarrito } from '../../contexts/CarritoContext';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

export default function Header() {
    const navigate = useNavigate();
    const { cantidadTotal } = useCarrito();
    const { isAuthenticated, user, logout, isAdmin, userName } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar expand="lg" className="custom-navbar" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-text">
                    Talento Tech Store
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Enlaces principales a la izquierda */}
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Inicio
                        </Nav.Link>
                        <Nav.Link as={Link} to="/productos">
                            Productos
                        </Nav.Link>
                        <Nav.Link as={Link} to="/contacto">
                            Contacto
                        </Nav.Link>
                    </Nav>
                    
                    {/* Carrito y autenticación a la derecha */}
                    <Nav>
                        {/* Carrito - solo visible para usuarios autenticados */}
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/carrito" className="carrito-link">
                                <FaShoppingCart /> 
                                Carrito
                                {cantidadTotal > 0 && (
                                    <Badge bg="danger" className="carrito-badge">
                                        {cantidadTotal}
                                    </Badge>
                                )}
                            </Nav.Link>
                        )}
                        
                        {isAuthenticated ? (
                            <>
                                {/* Dropdown del usuario autenticado */}
                                <Dropdown as={Nav.Item} align="end">
                                    <Dropdown.Toggle as={Nav.Link} className="user-dropdown">
                                        <FaUser className="me-2" />
                                        {userName}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Header>
                                            <small className="text-muted">
                                                {user?.email}
                                            </small>
                                            <br />
                                            <Badge 
                                                bg={isAdmin ? "danger" : "primary"} 
                                                className="mt-1"
                                            >
                                                {user?.rol}
                                            </Badge>
                                        </Dropdown.Header>
                                        <Dropdown.Divider />
                                        <Dropdown.Item as={Link} to="/perfil">
                                            <FaUser className="me-2" />
                                            Mi Perfil
                                        </Dropdown.Item>
                                        {isAdmin && (
                                            <Dropdown.Item as={Link} to="/dashboard">
                                                <FaTachometerAlt className="me-2" />
                                                Dashboard
                                            </Dropdown.Item>
                                        )}
                                        <Dropdown.Item as={Link} to="/configuracion">
                                            <FaCog className="me-2" />
                                            Configuración
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout} className="text-danger">
                                            <FaSignOutAlt className="me-2" />
                                            Cerrar Sesión
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login">
                                <FaSignInAlt /> Iniciar Sesión
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
} 