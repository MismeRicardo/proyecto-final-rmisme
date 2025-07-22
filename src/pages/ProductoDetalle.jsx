import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaShoppingCart, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useCarrito } from '../contexts/CarritoContext';
import { Link } from 'react-router-dom';
import './ProductoDetalle.css';

const ProductoDetalle = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const { agregarProducto, estaEnCarrito } = useCarrito();

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                // Obtenemos todos los productos y filtramos por ID
                const response = await fetch('https://6839b4a46561b8d882b1637c.mockapi.io/api/v1/products');
                const productos = await response.json();
                
                // Filtramos el producto por ID
                const productoEncontrado = productos.find(p => p.id === parseInt(id));
                
                if (productoEncontrado) {
                    setProducto(productoEncontrado);
                } else {
                    setProducto(null);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar el producto:', error);
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);

    if (loading) {
        return (
            <Container className="producto-detalle">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (!producto) {
        return (
            <Container className="producto-detalle">
                <div className="text-center">
                    <h2>Producto no encontrado</h2>
                    <Button as={Link} to="/productos" variant="primary" className="mt-3">
                        <FaArrowLeft className="me-2" />
                        Volver a productos
                    </Button>
                </div>
            </Container>
        );
    }

    const handleAgregarCarrito = () => {
        agregarProducto(producto);
    };

    return (
        <Container className="producto-detalle">
            <div className="mb-3">
                <Button as={Link} to="/productos" variant="outline-secondary">
                    <FaArrowLeft className="me-2" />
                    Volver a productos
                </Button>
            </div>
            <Row className="justify-content-center">
                <Col md={6} className="mb-4">
                    <div className="imagen-container">
                        <img src={producto.image} alt={producto.title} className="img-fluid producto-imagen" />
                    </div>
                </Col>
                <Col md={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h2 className="producto-titulo">{producto.title}</h2>
                            <p className="producto-categoria">Categoría: {producto.category}</p>
                            <p className="producto-descripcion">{producto.description}</p>
                            <div className="producto-precio-container">
                                <h3 className="producto-precio">${producto.price}</h3>
                                <Button 
                                    variant={estaEnCarrito(producto.id) ? "success" : "primary"} 
                                    className="btn-comprar"
                                    onClick={handleAgregarCarrito}
                                    size="lg"
                                >
                                    {estaEnCarrito(producto.id) ? (
                                        <>
                                            <FaCheck className="me-2" />
                                            Agregado al carrito
                                        </>
                                    ) : (
                                        <>
                                            <FaShoppingCart className="me-2" />
                                            Agregar al Carrito
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductoDetalle; 