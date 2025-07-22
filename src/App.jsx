import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AgregarProducto from './pages/AgregarProducto';
import EditarProducto from './pages/EditarProducto';
import Carrito from './pages/Carrito';
import ProductoDetalle from './pages/ProductoDetalle';
import ProtectedRoute, { AdminRoute, AuthRoute, PublicRoute } from './components/ProtectedRoute';
import { CarritoProvider } from './contexts/CarritoContext';
import { AuthProvider, AuthLoading } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <AuthLoading>
            <div className="app-container">
              <Header/>
              <main>
                <Routes>
                  {/* Rutas públicas */}
                  <Route path='/' element={<Home/>}/> 
                  <Route path='/productos' element={<Productos/>}/>
                  <Route path='/productos/:id' element={<ProductoDetalle/>}/>
                  <Route path='/contacto' element={<Contacto/>}/>
                  
                  {/* Ruta de login (redirige si ya está autenticado) */}
                  <Route 
                    path='/login' 
                    element={
                      <PublicRoute redirectIfAuthenticated="/">
                        <Login/>
                      </PublicRoute>
                    }
                  />
                  
                  {/* Rutas protegidas - requieren autenticación */}
                  <Route
                    path="/carrito"
                    element={
                      <AuthRoute>
                        <Carrito />
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/perfil"
                    element={
                      <AuthRoute>
                        <Profile />
                      </AuthRoute>
                    }
                  />
                  
                  {/* Rutas de administrador - requieren rol admin */}
                  <Route
                    path="/dashboard"
                    element={
                      <AdminRoute>
                        <Dashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/agregar-producto"
                    element={
                      <AdminRoute>
                        <AgregarProducto />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/editar-producto/:id"
                    element={
                      <AdminRoute>
                        <EditarProducto />
                      </AdminRoute>
                    }
                  />
                  
                  {/* Ruta de configuración - solo para usuarios autenticados */}
                  <Route
                    path="/configuracion"
                    element={
                      <AuthRoute>
                        <div className="container mt-5">
                          <h2>Configuración</h2>
                          <p>Página de configuración en desarrollo...</p>
                        </div>
                      </AuthRoute>
                    }
                  />
                  
                  {/* Ruta 404 */}
                  <Route 
                    path="*" 
                    element={
                      <div className="container mt-5 text-center">
                        <h2>Página no encontrada</h2>
                        <p>La página que buscas no existe.</p>
                      </div>
                    } 
                  />
                </Routes>
              </main>
              <Footer/>
            </div>
          </AuthLoading>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  )
}

export default App
