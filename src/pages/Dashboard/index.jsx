import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaChartLine, FaClipboardList } from 'react-icons/fa';
import './styles.css';

export default function Dashboard() {
    const stats = [
        {
            title: 'Pedidos Totales',
            value: '150',
            icon: <FaShoppingCart />,
            color: '#3498db'
        },
        {
            title: 'Clientes',
            value: '85',
            icon: <FaUser />,
            color: '#2ecc71'
        },
        {
            title: 'Ventas',
            value: '$12,450',
            icon: <FaChartLine />,
            color: '#e74c3c'
        },
        {
            title: 'Productos',
            value: '45',
            icon: <FaClipboardList />,
            color: '#f39c12'
        }
    ];

    return (
        <Container className="dashboard-container">
            <h2 className="text-center mb-4">Dashboard</h2>
            <Row>
                {stats.map((stat, index) => (
                    <Col key={index} md={3} sm={6} className="mb-4">
                        <Card className="dashboard-card">
                            <Card.Body>
                                <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div className="stat-info">
                                    <h3>{stat.value}</h3>
                                    <p>{stat.title}</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="mt-4">
                <Col md={8} className="mb-4">
                    <Card className="dashboard-card h-100">
                        <Card.Body>
                            <h4>Actividad Reciente</h4>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <span className="activity-dot"></span>
                                    <div className="activity-content">
                                        <p>Nuevo pedido recibido</p>
                                        <small>Hace 5 minutos</small>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <span className="activity-dot"></span>
                                    <div className="activity-content">
                                        <p>Cliente nuevo registrado</p>
                                        <small>Hace 15 minutos</small>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <span className="activity-dot"></span>
                                    <div className="activity-content">
                                        <p>Producto actualizado</p>
                                        <small>Hace 30 minutos</small>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="dashboard-card h-100">
                        <Card.Body>
                            <h4>Resumen</h4>
                            <div className="summary-list">
                                <div className="summary-item">
                                    <span>Ventas del Mes</span>
                                    <strong>$45,850</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Pedidos Pendientes</span>
                                    <strong>23</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Clientes Nuevos</span>
                                    <strong>12</strong>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
} 