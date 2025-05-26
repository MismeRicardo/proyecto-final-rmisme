import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './styles.css';

const Contacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
    });

    const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            alert('Mensaje enviado con éxito!');
            setFormData({
                nombre: '',
                email: '',
                asunto: '',
                mensaje: ''
            });
        }

        setValidated(true);
    };

    const infoContacto = [
        {
            icon: <FaPhone className="contact-icon" />,
            title: "Telefono",
            info: "+57 1133785284",
            color: "#FF6B6B"
        },
        {
            icon: <FaEnvelope className="contact-icon" />,
            title: "Email",
            info: "contacto@TalentoTechStore.com",
            color: "#4ECDC4"
        },
        {
            icon: <FaMapMarkerAlt className="contact-icon" />,
            title: "Direccion",
            info: "Calle Prueba #654, Buenos Aires",
            color: "#FFD93D"
        }
    ];

    return (
        <Container className="my-5">
            <h1 className="text-center mb-5">Contactanos</h1>
            
            <Row className="mb-5 justify-content-center">
                {infoContacto.map((item, index) => (
                    <Col key={index} md={4} sm={6} className="mb-4">
                        <Card className="contact-card h-100 text-center">
                            <Card.Body>
                                <div 
                                    className="icon-circle mb-3"
                                    style={{ backgroundColor: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>{item.info}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="contact-form-card">
                        <Card.Body className="p-4">
                            <h3 className="text-center mb-4">Envíanos un mensaje</h3>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                placeholder="Tu nombre"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Por favor ingresa tu nombre
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="tu@email.com"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Por favor ingresa un email válido
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Asunto</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        name="asunto"
                                        value={formData.asunto}
                                        onChange={handleChange}
                                        placeholder="Asunto de tu mensaje"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor ingresa el asunto
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Mensaje</Form.Label>
                                    <Form.Control
                                        required
                                        as="textarea"
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Escribe tu mensaje aquí"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor ingresa tu mensaje
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="text-center">
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        size="lg"
                                        className="px-5"
                                    >
                                        Enviar Mensaje
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Contacto; 