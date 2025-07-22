import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaSave, FaImage, FaTimes, FaEdit } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';

export default function EditarProducto() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [productNotFound, setProductNotFound] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        image: ''
    });

    const [originalData, setOriginalData] = useState(null);

    const categorias = [
        { value: "men's clothing", label: "Ropa de Hombre" },
        { value: "women's clothing", label: "Ropa de Mujer" },
        { value: "jewelery", label: "Joyería" },
        { value: "electronics", label: "Electrónicos" }
    ];

    // Cargar producto al montar el componente
    useEffect(() => {
        const fetchProducto = async () => {
            try {
                setLoadingProduct(true);
                const response = await fetch(`https://6839b4a46561b8d882b1637c.mockapi.io/api/v1/products/${id}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        setProductNotFound(true);
                    } else {
                        throw new Error('Error al cargar el producto');
                    }
                    return;
                }

                const producto = await response.json();
                const productData = {
                    title: producto.title || '',
                    price: producto.price || '',
                    description: producto.description || '',
                    category: producto.category || '',
                    image: producto.image || ''
                };
                
                setFormData(productData);
                setOriginalData(productData);
                
            } catch (error) {
                console.error('Error al cargar producto:', error);
                setError('Error al cargar el producto. Verifica que el ID sea válido.');
            } finally {
                setLoadingProduct(false);
            }
        };

        if (id) {
            fetchProducto();
        } else {
            setError('ID de producto no válido');
            setLoadingProduct(false);
        }
    }, [id]);

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

    const hasChanges = () => {
        if (!originalData) return false;
        
        return Object.keys(formData).some(key => 
            formData[key].toString() !== originalData[key].toString()
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }

        if (!hasChanges()) {
            setError('No se han realizado cambios en el producto');
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
                // Mantener el rating existente
                rating: originalData.rating || {
                    rate: 0,
                    count: 0
                }
            };

            const response = await fetch(`https://6839b4a46561b8d882b1637c.mockapi.io/api/v1/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productoData)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }

            const productoActualizado = await response.json();
            console.log('Producto actualizado:', productoActualizado);

            setSuccess('¡Producto actualizado exitosamente!');
            setOriginalData(formData); // Actualizar los datos originales

            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
            setError('Error al actualizar el producto. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleVolver = () => {
        navigate('/dashboard');
    };

    const resetearCambios = () => {
        if (originalData) {
            setFormData(originalData);
            setError('');
            setSuccess('');
        }
    };

    // Estado de carga inicial
    if (loadingProduct) {
        return (
            <Container className="editar-producto-container text-center">
                <div className="loading-state">
                    <Spinner animation="border" variant="primary" size="lg" />
                    <h5 className="mt-3">Cargando producto...</h5>
                    <p className="text-muted">Por favor espera mientras cargamos la información</p>
                </div>
            </Container>
        );
    }

    // Estado de producto no encontrado
    if (productNotFound) {
        return (
            <Container className="editar-producto-container text-center">
                <div className="not-found-state">
                    <h2 className="text-danger mb-3">Producto no encontrado</h2>
                    <p className="text-muted mb-4">El producto con ID {id} no existe o fue eliminado.</p>
                    <Button variant="primary" onClick={handleVolver}>
                        <FaArrowLeft className="me-2" />
                        Volver al Dashboard
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="editar-producto-container">
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
                            <h2 className="page-title mb-0">
                                <FaEdit className="me-2" />
                                Editar Producto #{id}
                            </h2>
                            <p className="text-muted mb-0">Modifica la información del producto</p>
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
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Información del Producto</h5>
                                {hasChanges() && (
                                    <small className="text-warning bg-dark px-2 py-1 rounded">
                                        ⚠️ Hay cambios sin guardar
                                    </small>
                                )}
                            </div>
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
                                        onClick={resetearCambios}
                                        disabled={loading || !hasChanges()}
                                        className="me-3"
                                    >
                                        <FaTimes className="me-2" />
                                        Deshacer Cambios
                                    </Button>
                                    <Button
                                        variant="warning"
                                        type="submit"
                                        disabled={loading || !hasChanges()}
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
                                                Actualizando...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="me-2" />
                                                Actualizar Producto
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