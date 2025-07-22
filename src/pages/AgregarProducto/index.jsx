import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaSave, FaImage, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function AgregarProducto() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        image: ''
    });

    const categorias = [
        { value: "men's clothing", label: "Ropa de Hombre" },
        { value: "women's clothing", label: "Ropa de Mujer" },
        { value: "jewelery", label: "Joyería" },
        { value: "electronics", label: "Electrónicos" }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar mensajes al escribir
        if (error) setError('');
        if (success) setSuccess('');
    };

    const validarFormulario = () => {
        if (!formData.title.trim()) {
            setError('El título del producto es obligatorio');
            return false;
        }
        if (!formData.price || formData.price <= 0) {
            setError('El precio debe ser mayor a 0');
            return false;
        }
        if (!formData.description.trim()) {
            setError('La descripción es obligatoria');
            return false;
        }
        if (!formData.category) {
            setError('Debe seleccionar una categoría');
            return false;
        }
        if (!formData.image.trim()) {
            setError('La URL de la imagen es obligatoria');
            return false;
        }
        
        // Validar URL de imagen
        try {
            new URL(formData.image);
        } catch {
            setError('La URL de la imagen no es válida');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const productoData = {
                title: formData.title.trim(),
                price: parseFloat(formData.price),
                description: formData.description.trim(),
                category: formData.category,
                image: formData.image.trim(),
                rating: {
                    rate: 0,
                    count: 0
                }
            };

            const response = await fetch('https://6839b4a46561b8d882b1637c.mockapi.io/api/v1/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productoData)
            });

            if (!response.ok) {
                throw new Error('Error al crear el producto');
            }

            const nuevoProducto = await response.json();
            console.log('Producto creado:', nuevoProducto);

            setSuccess('¡Producto agregado exitosamente!');
            
            // Limpiar formulario
            setFormData({
                title: '',
                price: '',
                description: '',
                category: '',
                image: ''
            });

            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            setError('Error al agregar el producto. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleVolver = () => {
        navigate('/dashboard');
    };

    const limpiarFormulario = () => {
        setFormData({
            title: '',
            price: '',
            description: '',
            category: '',
            image: ''
        });
        setError('');
        setSuccess('');
    };

    return (
        <Container className="agregar-producto-container">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center gap-3">
                        <Button 
                            variant="outline-secondary" 
                            onClick={handleVolver}
                            className="btn-volver"
                        >
                            <FaArrowLeft className="me-2" />
                            Volver al Dashboard
                        </Button>
                        <div>
                            <h2 className="page-title mb-0">Agregar Nuevo Producto</h2>
                            <p className="text-muted mb-0">Completa la información del producto</p>
                        </div>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success" className="mb-4">
                    {success}
                </Alert>
            )}

            <Row>
                <Col lg={8} className="mx-auto">
                    <Card className="form-card">
                        <Card.Header className="form-header">
                            <h5 className="mb-0">Información del Producto</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="form-label">
                                                Título del Producto *
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="Ingresa el nombre del producto"
                                                className="form-input"
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="form-label">
                                                Precio (USD) *
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                className="form-input"
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="form-label">
                                        Categoría *
                                    </Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        disabled={loading}
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categorias.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="form-label">
                                        Descripción *
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe el producto detalladamente..."
                                        className="form-input"
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="form-label">
                                        <FaImage className="me-2" />
                                        URL de la Imagen *
                                    </Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        className="form-input"
                                        disabled={loading}
                                    />
                                    <Form.Text className="text-muted">
                                        Proporciona una URL válida de la imagen del producto
                                    </Form.Text>
                                    
                                    {formData.image && (
                                        <div className="image-preview mt-3">
                                            <p className="mb-2"><strong>Vista previa:</strong></p>
                                            <img
                                                src={formData.image}
                                                alt="Vista previa"
                                                className="preview-image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                                onLoad={(e) => {
                                                    e.target.style.display = 'block';
                                                }}
                                            />
                                        </div>
                                    )}
                                </Form.Group>

                                <div className="form-actions">
                                    <Button
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={limpiarFormulario}
                                        disabled={loading}
                                        className="me-3"
                                    >
                                        <FaTimes className="me-2" />
                                        Limpiar
                                    </Button>
                                    <Button
                                        variant="success"
                                        type="submit"
                                        disabled={loading}
                                        className="btn-submit"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    className="me-2"
                                                />
                                                Agregando...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="me-2" />
                                                Agregar Producto
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
} 