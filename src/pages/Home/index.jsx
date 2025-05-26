import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTshirt, FaLaptop, FaGem, FaShippingFast, FaCreditCard, FaHeadset } from "react-icons/fa";
import './styles.css';

export default function Home() {
    const carouselImages = [
        {
            id: 1,
            image: "https://img.freepik.com/premium-psd/smart-phone-sale-promotion-black-friday-sale-web-banner-template_179771-192.jpg",
            alt: "Black Friday"
        },
        {
            id: 2,
            image: "https://img.freepik.com/premium-psd/gaming-laptop-sale-promotion-banner_252779-743.jpg",
            alt: "Notebook moderna"
        },
        {
            id: 3,
            image: "https://img.freepik.com/free-photo/big-sale-discounts-products_23-2150336669.jpg",
            alt: "Mega Sale"
        }
    ];

    const categories = [
        {
            id: 1,
            title: "Ropa",
            description: "Descubre las ultimas tendencias en moda para todas las ocasiones",
            icon: <FaTshirt />,
            color: "#FF6B6B",
            link: "/productos?categoria=ropa"
        },
        {
            id: 2,
            title: "Electronica",
            description: "Los mejores dispositivos y gadgets tecnologicos",
            icon: <FaLaptop />,
            color: "#4ECDC4",
            link: "/productos?categoria=electronica"
        },
        {
            id: 3,
            title: "Joyeria",
            description: "Accesorios elegantes para complementar tu estilo",
            icon: <FaGem />,
            color: "#FFD93D",
            link: "/productos?categoria=joyeria"
        }
    ];

    const features = [
        {
            icon: <FaShippingFast />,
            title: "Envio Gratis",
            description: "En pedidos superiores a 40000"
        },
        {
            icon: <FaCreditCard />,
            title: "Pago Seguro",
            description: "Multiples métodos de pago"
        },
        {
            icon: <FaHeadset />,
            title: "Atencion 24/7",
            description: "Soporte cuando lo necesites"
        }
    ];

    return (
        <>
            <div className="hero-section text-light d-flex align-items-center">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="text-start">
                            <h1 className="display-4 fw-bold mb-4">Descubre Nuestra Colección</h1>
                            <p className="lead mb-4">
                                Las mejores marcas y productos seleccionados para ti. 
                                Calidad y estilo en un solo lugar.
                            </p>
                            <Button 
                                as={Link} 
                                to="/productos" 
                                variant="light" 
                                size="lg"
                                className="rounded-pill px-4"
                            >
                                Ver Productos
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="my-5">
                <Carousel interval={3000} className="product-carousel">
                    {carouselImages.map((item) => (
                        <Carousel.Item key={item.id}>
                            <img
                                className="d-block w-100"
                                src={item.image}
                                alt={item.alt}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>

            <Container className="my-5">
                <h2 className="text-center mb-5">Explora Nuestras Categorías</h2>
                <Row className="g-4">
                    {categories.map((category) => (
                        <Col key={category.id} md={4}>
                            <Link to={category.link} className="text-decoration-none">
                                <Card className="h-100 shadow-sm category-card">
                                    <Card.Body className="text-center">
                                        <div 
                                            className="category-icon mb-3 d-inline-flex align-items-center justify-content-center rounded-circle"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                backgroundColor: category.color,
                                                color: 'white',
                                                fontSize: '2.5rem'
                                            }}
                                        >
                                            {category.icon}
                                        </div>
                                        <Card.Title className="h4 mb-3">{category.title}</Card.Title>
                                        <Card.Text className="text-muted">
                                            {category.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>

            <div className="bg-light py-5">
                <Container>
                    <h2 className="text-center mb-5">¿Por qué elegirnos?</h2>
                    <Row className="g-4">
                        {features.map((feature, index) => (
                            <Col key={index} md={4}>
                                <div className="text-center">
                                    <div className="feature-icon mb-3 d-inline-flex align-items-center justify-content-center rounded-circle">
                                        {feature.icon}
                                    </div>
                                    <h4>{feature.title}</h4>
                                    <p className="text-muted">{feature.description}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </>
    );
} 