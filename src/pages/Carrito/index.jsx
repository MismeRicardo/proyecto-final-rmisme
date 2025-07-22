import React from 'react';
import { Container, Row, Col, Card, Button, Image, Alert, Badge } from 'react-bootstrap';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { useCarrito } from '../../contexts/CarritoContext';
import { Link } from 'react-router-dom';
import './styles.css';

const Carrito = () => {
  const {
    productos,
    cantidadTotal,
    precioTotal,
    eliminarProducto,
    actualizarCantidad,
    vaciarCarrito
  } = useCarrito();

  const handleCantidadChange = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    actualizarCantidad(id, nuevaCantidad);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio * 1000); // Multiplicamos por 1000 para simular precios en pesos colombianos
  };

  if (productos.length === 0) {
    return (
      <Container className="carrito-container">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div className="carrito-vacio">
              <FaShoppingCart size={80} className="text-muted mb-4" />
              <h3>Tu carrito está vacío</h3>
              <p className="text-muted mb-4">
                ¡Agrega algunos productos increíbles para comenzar!
              </p>
              <Button as={Link} to="/productos" variant="primary" size="lg">
                Ver Productos
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="carrito-container">
      <Row>
        <Col>
          <div className="carrito-header">
            <h2>
              <FaShoppingCart className="me-3" />
              Mi Carrito
              <Badge bg="primary" className="ms-3">
                {cantidadTotal} {cantidadTotal === 1 ? 'producto' : 'productos'}
              </Badge>
            </h2>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="carrito-productos">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Productos en tu carrito</h5>
              <Button
                size="sm"
                onClick={vaciarCarrito}
                className="btn-vaciar"
              >
                <FaTrash className="me-2" />
                Vaciar carrito
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {productos.map((producto) => (
                <div key={producto.id} className="producto-carrito">
                  <Row className="align-items-center">
                    <Col xs={3} md={2}>
                      <Image
                        src={producto.image}
                        alt={producto.title}
                        className="producto-imagen"
                        fluid
                      />
                    </Col>
                    
                    <Col xs={9} md={4}>
                      <h6 className="producto-titulo">{producto.title}</h6>
                      <p className="producto-categoria text-muted">
                        {producto.category}
                      </p>
                    </Col>
                    
                    <Col xs={6} md={2} className="text-center">
                      <div className="cantidad-controles">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleCantidadChange(producto.id, producto.cantidad - 1)}
                          disabled={producto.cantidad <= 1}
                        >
                          <FaMinus />
                        </Button>
                        <span className="cantidad-display">
                          {producto.cantidad}
                        </span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleCantidadChange(producto.id, producto.cantidad + 1)}
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </Col>
                    
                    <Col xs={4} md={2} className="text-center">
                      <div className="precio-info">
                        <div className="precio-unitario">
                          {formatearPrecio(producto.price)}
                        </div>
                        <div className="precio-total">
                          {formatearPrecio(producto.price * producto.cantidad)}
                        </div>
                      </div>
                    </Col>
                    
                    <Col xs={2} md={2} className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => eliminarProducto(producto.id)}
                        className="btn-eliminar"
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="resumen-carrito sticky-top">
            <Card.Header>
              <h5 className="mb-0">Resumen del pedido</h5>
            </Card.Header>
            <Card.Body>
              <div className="resumen-detalle">
                <Row className="mb-2">
                  <Col>Subtotal ({cantidadTotal} productos):</Col>
                  <Col className="text-end">
                    {formatearPrecio(precioTotal)}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>Envío:</Col>
                  <Col className="text-end text-success">
                    GRATIS
                  </Col>
                </Row>
                <hr />
                <Row className="total-final">
                  <Col>
                    <strong>Total:</strong>
                  </Col>
                  <Col className="text-end">
                    <strong>{formatearPrecio(precioTotal)}</strong>
                  </Col>
                </Row>
              </div>
              
              <div className="botones-accion mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={productos.length === 0}
                >
                  Proceder al pago
                </Button>
                <Button
                  as={Link}
                  to="/productos"
                  variant="outline-primary"
                  className="w-100"
                >
                  Seguir comprando
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Carrito; 