import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignInAlt, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import './styles.css';

export default function Header() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    const cerrarSesion = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');
    }
    const handleLogout = () => {
        cerrarSesion();
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
                        {isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to="/perfil">
                                    <FaUser /> Mi Perfil
                                </Nav.Link>
                                <Nav.Link as={Link} to="/dashboard">
                                    <FaTachometerAlt /> Dashboard
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                    
                    <Nav>
                        <Nav.Link as={Link} to="/carrito">
                            <FaShoppingCart /> Carrito
                        </Nav.Link>
                        {isAuthenticated ? (
                            <Nav.Link onClick={handleLogout}>
                                <FaSignOutAlt /> Cerrar Sesión
                            </Nav.Link>
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