import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './styles.css';

export default function Profile() {
    const userProfile = {
        nombre: 'Usuario Demo',
        email: 'usuario@demo.com',
        telefono: '+34 123 456 789',
        direccion: 'Calle Principal 123'
    };

    return (
        <Container className="profile-container">
            <h2 className="text-center mb-4">Mi Perfil</h2>
            <Card className="profile-card">
                <Card.Body>
                    <Row>
                        <Col md={4} className="text-center mb-4 mb-md-0">
                            <div className="profile-avatar">
                                <FaUser size={50} />
                            </div>
                        </Col>
                        <Col md={8}>
                            <div className="profile-info">
                                <div className="info-item">
                                    <FaUser className="info-icon" />
                                    <div>
                                        <h6>Nombre</h6>
                                        <p>{userProfile.nombre}</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FaEnvelope className="info-icon" />
                                    <div>
                                        <h6>Email</h6>
                                        <p>{userProfile.email}</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FaPhone className="info-icon" />
                                    <div>
                                        <h6>Teléfono</h6>
                                        <p>{userProfile.telefono}</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FaMapMarkerAlt className="info-icon" />
                                    <div>
                                        <h6>Dirección</h6>
                                        <p>{userProfile.direccion}</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
} 