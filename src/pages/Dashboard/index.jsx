import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Badge, Image, Button, Row, Col, Alert, Spinner, Pagination, InputGroup, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados para el modal de eliminar
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('https://6839b4a46561b8d882b1637c.mockapi.io/api/v1/products');
                const data = await response.json();
                setProductos(data);
                setFilteredProductos(data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setError('Error al cargar los productos');
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    // Función para filtrar productos
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredProductos(productos);
        } else {
            const filtered = productos.filter(producto =>
                producto.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProductos(filtered);
        }
        // Resetear a la primera página cuando se filtra
        setCurrentPage(1);
    }, [searchTerm, productos]);

    // Calcular productos para la página actual
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProductos.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProductos.length / productsPerPage);

    // Función para cambiar de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll suave hacia arriba al cambiar de página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Función para limpiar búsqueda
    const clearSearch = () => {
        setSearchTerm('');
    };

    // Funciones para eliminar producto
    const handleDeleteClick = (producto) => {
        setProductToDelete(producto);
        setShowDeleteModal(true);
        setError(null);
        setDeleteSuccess('');
    };

    const handleCloseDeleteModal = () => {
        if (!deleting) {
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        setDeleting(true);
        setError(null);

        try {
            const response = await fetch(`https://6839b4a46561b8d882b1637c.mockapi.io/api/v1/products/${productToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }

            // Actualizar la lista local de productos
            const updatedProductos = productos.filter(p => p.id !== productToDelete.id);
            setProductos(updatedProductos);
            setFilteredProductos(updatedProductos.filter(producto =>
                searchTerm === '' || 
                producto.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.category.toLowerCase().includes(searchTerm.toLowerCase())
            ));

            // Ajustar página si es necesario
            const newTotalPages = Math.ceil(updatedProductos.length / productsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }

            setDeleteSuccess(`Producto "${productToDelete.title}" eliminado exitosamente`);
            setShowDeleteModal(false);
            setProductToDelete(null);

            // Limpiar mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setDeleteSuccess('');
            }, 3000);

        } catch (error) {
            console.error('Error al eliminar producto:', error);
            setError('Error al eliminar el producto. Inténtalo de nuevo.');
        } finally {
            setDeleting(false);
        }
    };

    // Generar números de página para mostrar
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(precio);
    };

    const getBadgeColor = (categoria) => {
        const colores = {
            "men's clothing": "primary",
            "women's clothing": "danger",
            "jewelery": "warning",
            "electronics": "success"
        };
        return colores[categoria] || "secondary";
    };

    const truncateText = (text, maxLength = 50) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    if (loading) {
        return (
            <Container className="dashboard-container text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Cargando productos...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="dashboard-container">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="dashboard-container">
            <Row className="mb-4">
                <Col>
                    <h2 className="dashboard-title">Dashboard - Gestión de Productos</h2>
                    <p className="text-muted">Administra y visualiza todos los productos de la tienda</p>
                </Col>
                <Col xs="auto">
                    <Button 
                        variant="success" 
                        className="btn-add-product"
                        onClick={() => navigate('/agregar-producto')}
                    >
                        <FaPlus className="me-2" />
                        Agregar Producto
                    </Button>
                </Col>
            </Row>

            {/* Buscador */}
            <Row className="mb-3">
                <Col>
                    <Card className="search-card">
                        <Card.Body>
                            <InputGroup className="search-input-group">
                                <InputGroup.Text className="search-icon">
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por título, descripción o categoría..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                {searchTerm && (
                                    <Button 
                                        variant="outline-secondary"
                                        onClick={clearSearch}
                                        className="clear-search-btn"
                                        title="Limpiar búsqueda"
                                    >
                                        <FaTimes />
                                    </Button>
                                )}
                            </InputGroup>
                            {searchTerm && (
                                <div className="search-results-info mt-2">
                                    <small className="text-muted">
                                        {filteredProductos.length === 0 
                                            ? `No se encontraron productos que coincidan con "${searchTerm}"`
                                            : `${filteredProductos.length} producto${filteredProductos.length !== 1 ? 's' : ''} encontrado${filteredProductos.length !== 1 ? 's' : ''} para "${searchTerm}"`
                                        }
                                    </small>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Mensaje de éxito al eliminar */}
            {deleteSuccess && (
                <Alert variant="success" className="mb-3" dismissible onClose={() => setDeleteSuccess('')}>
                    {deleteSuccess}
                </Alert>
            )}

            <Card className="products-table-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Lista de Productos</h5>
                    <div className="d-flex align-items-center gap-3">
                        <Badge bg="info">
                            Página {currentPage} de {totalPages || 1}
                        </Badge>
                        <Badge bg="secondary">
                            {filteredProductos.length} producto{filteredProductos.length !== 1 ? 's' : ''}
                            {searchTerm && ` (filtrado${filteredProductos.length !== 1 ? 's' : ''})`}
                        </Badge>
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    {filteredProductos.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="no-results">
                                <FaSearch className="no-results-icon mb-3" />
                                <h5>No se encontraron productos</h5>
                                <p className="text-muted">
                                    {searchTerm 
                                        ? `No hay productos que coincidan con "${searchTerm}"`
                                        : 'No hay productos disponibles'
                                    }
                                </p>
                                {searchTerm && (
                                    <Button variant="outline-primary" onClick={clearSearch}>
                                        Limpiar búsqueda
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Imagen</th>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Rating</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((producto) => (
                                        <tr key={producto.id}>
                                            <td className="align-middle">
                                                <Badge bg="secondary">#{producto.id}</Badge>
                                            </td>
                                            <td className="align-middle">
                                                <Image
                                                    src={producto.image}
                                                    alt={producto.title}
                                                    className="product-thumbnail"
                                                    roundedCircle
                                                />
                                            </td>
                                            <td className="align-middle">
                                                <div>
                                                    <strong>{truncateText(producto.title, 40)}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        {truncateText(producto.description, 60)}
                                                    </small>
                                                </div>
                                            </td>
                                            <td className="align-middle">
                                                <Badge bg={getBadgeColor(producto.category)}>
                                                    {producto.category}
                                                </Badge>
                                            </td>
                                            <td className="align-middle">
                                                <strong className="price-text">
                                                    {formatearPrecio(producto.price)}
                                                </strong>
                                            </td>
                                            <td className="align-middle">
                                                <div className="rating-container">
                                                    <Badge bg="warning" text="dark">
                                                        ⭐ {producto.rating?.rate || 'N/A'}
                                                    </Badge>
                                                    <br />
                                                    <small className="text-muted">
                                                        ({producto.rating?.count || 0} reviews)
                                                    </small>
                                                </div>
                                            </td>
                                            <td className="align-middle">
                                                                                            <div className="action-buttons">
                                                <Button 
                                                    variant="outline-warning" 
                                                    size="sm" 
                                                    className="me-1"
                                                    title="Editar"
                                                    onClick={() => navigate(`/editar-producto/${producto.id}`)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    title="Eliminar"
                                                    onClick={() => handleDeleteClick(producto)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
                
                {/* Paginación */}
                {totalPages > 1 && (
                    <Card.Footer className="d-flex justify-content-center">
                        <Pagination className="custom-pagination mb-0">
                            <Pagination.First 
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                            />
                            <Pagination.Prev 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                            
                            {getPageNumbers().map((number, index) => (
                                <React.Fragment key={index}>
                                    {number === '...' ? (
                                        <Pagination.Ellipsis disabled />
                                    ) : (
                                        <Pagination.Item
                                            active={number === currentPage}
                                            onClick={() => handlePageChange(number)}
                                        >
                                            {number}
                                        </Pagination.Item>
                                    )}
                                </React.Fragment>
                            ))}
                            
                            <Pagination.Next 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                            <Pagination.Last 
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </Card.Footer>
                )}
            </Card>
            
            {/* Información de la paginación */}
            {filteredProductos.length > 0 && (
                <Row className="mt-3">
                    <Col className="text-center">
                        <small className="text-muted">
                            Mostrando {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, filteredProductos.length)} de {filteredProductos.length} productos
                            {searchTerm && ` (filtrados)`}
                        </small>
                    </Col>
                </Row>
            )}

            {/* Modal de confirmación para eliminar */}
            <Modal 
                show={showDeleteModal} 
                onHide={handleCloseDeleteModal}
                centered
                backdrop={deleting ? "static" : true}
                keyboard={!deleting}
            >
                <Modal.Header closeButton={!deleting} className="delete-modal-header">
                    <Modal.Title className="d-flex align-items-center">
                        <FaExclamationTriangle className="text-warning me-2" />
                        Confirmar Eliminación
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="delete-modal-body">
                    {productToDelete && (
                        <div>
                            <p className="mb-3">
                                ¿Estás seguro de que deseas eliminar el siguiente producto?
                            </p>
                            <div className="product-to-delete">
                                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                                    <Image
                                        src={productToDelete.image}
                                        alt={productToDelete.title}
                                        width="60"
                                        height="60"
                                        className="rounded"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h6 className="mb-1">{productToDelete.title}</h6>
                                        <p className="mb-1 text-muted">
                                            <Badge bg="secondary">{productToDelete.category}</Badge>
                                        </p>
                                        <p className="mb-0 fw-bold text-success">
                                            ${productToDelete.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 p-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded">
                                <p className="mb-0 text-danger">
                                    <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. 
                                    El producto será eliminado permanentemente de la base de datos.
                                </p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="delete-modal-footer">
                    <Button 
                        variant="secondary" 
                        onClick={handleCloseDeleteModal}
                        disabled={deleting}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleConfirmDelete}
                        disabled={deleting}
                        className="btn-delete-confirm"
                    >
                        {deleting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    className="me-2"
                                />
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <FaTrash className="me-2" />
                                Sí, Eliminar
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
} 