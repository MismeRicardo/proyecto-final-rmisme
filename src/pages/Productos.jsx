import { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaTshirt, FaLaptop, FaGem } from 'react-icons/fa';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const categorias = [
        {
            id: 1,
            nombre: "Ropa",
            icon: <FaTshirt />,
            color: "#FF6B6B",
            filtro: "clothing"
        },
        {
            id: 2,
            nombre: "Electronica",
            icon: <FaLaptop />,
            color: "#4ECDC4",
            filtro: "electronics"
        },
        {
            id: 3,
            nombre: "Joyeria",
            icon: <FaGem />,
            color: "#FFD93D",
            filtro: "jewelery"
        }
    ];

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('https://fakestoreapi.com/products');
                const data = await response.json();
                setProductos(data);
            } catch (err) {
                setError('Error al llamar a la API');
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const productosFiltrados = categoriaSeleccionada
        ? productos.filter(producto => producto.category.includes(categoriaSeleccionada))
        : productos;

    if (loading) return (
        <Container className="text-center mt-5">
            <h2>Cargando productos...</h2>
        </Container>
    );

    if (error) return (
        <Container className="text-center mt-5">
            <h2>Error: {error}</h2>
        </Container>
    );

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Nuestros Productos</h1>
            
            <div className="categories-section mb-4">
                <Row className="g-3">
                    <Col xs={12}>
                        <div className="d-flex gap-3 flex-wrap">
                            <Badge 
                                bg={categoriaSeleccionada === null ? "primary" : "secondary"}
                                style={{ cursor: "pointer", padding: "10px 20px" }}
                                onClick={() => setCategoriaSeleccionada(null)}
                            >
                                Todos
                            </Badge>
                            {categorias.map((categoria) => (
                                <Badge
                                    key={categoria.id}
                                    bg={categoriaSeleccionada === categoria.filtro ? "primary" : "secondary"}
                                    style={{ 
                                        cursor: "pointer", 
                                        padding: "10px 20px",
                                        backgroundColor: categoriaSeleccionada === categoria.filtro ? categoria.color : undefined
                                    }}
                                    onClick={() => setCategoriaSeleccionada(categoria.filtro)}
                                >
                                    <span className="me-2">{categoria.icon}</span>
                                    {categoria.nombre}
                                </Badge>
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>

            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                {productosFiltrados.map((producto) => (
                    <Col key={producto.id}>
                        <Card className="h-100 shadow-sm">
                            <div className="text-center" style={{ height: '200px', overflow: 'hidden' }}>
                                <Card.Img 
                                    variant="top" 
                                    src={producto.image}
                                    style={{ 
                                        height: '100%', 
                                        objectFit: 'contain',
                                        padding: '1rem'
                                    }}
                                />
                            </div>
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="text-truncate">{producto.title}</Card.Title>
                                <Card.Text className="text-truncate">
                                    {producto.description}
                                </Card.Text>
                                <div className="mt-auto">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="mb-0">${producto.price}</h5>
                                    </div>
                                    <Button variant="primary" className="w-100">
                                        Agregar al carrito
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Productos;