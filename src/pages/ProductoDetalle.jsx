import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './ProductoDetalle.css';

const ProductoDetalle = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                const data = await response.json();
                setProducto(data);
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
                </div>
            </Container>
        );
    }

    return (
        <Container className="producto-detalle">
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
                                <Button variant="primary" className="btn-comprar">
                                    Agregar al Carrito
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