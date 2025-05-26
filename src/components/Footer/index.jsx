import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './styles.css';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-4">
            <Container>
                <Row>
                    <Col md={4} className="mb-4 mb-md-0">
                        <h5>Sobre Nosotros</h5>
                        <p>
                            Somos Talento Tech Store, ofrecemos los mejores productos
                            tecnologicos y más. Ofrecemos calidad y servicio excepcional.
                        </p>
                        <div className="contact-info">
                            <p><FaPhone className="me-2" /> +54 1133785284</p>
                            <p><FaEnvelope className="me-2" /> contacto@TalentoTechStore.com</p>
                            <p><FaMapMarkerAlt className="me-2" /> Calle Prueba #654, Buenos Aires</p>
                        </div>
                    </Col>
                    <Col md={4} className="mb-4 mb-md-0">
                        <h5>Enlaces Rapidos</h5>
                        <ul className="list-unstyled">
                            <li>
                                <Link to="/" className="footer-link">Inicio</Link>
                            </li>
                            <li>
                                <Link to="/productos" className="footer-link">Productos</Link>
                            </li>
                            <li>
                                <Link to="/contacto" className="footer-link">Contacto</Link>
                            </li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5>Síguenos</h5>
                        <div className="social-links">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaFacebook />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaTwitter />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaInstagram />
                            </a>
                        </div>
                        <div className="mt-3">
                            <h6>Horario de Atencion</h6>
                            <p className="mb-1">Lunes a Viernes: 9:00 - 18:00</p>
                            <p>Sábados: 9:00 - 13:00</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer; 