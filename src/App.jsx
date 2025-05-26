import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import RutaProtegida from './components/RutaProtegida';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header/>
        <main>
          <Routes>
            <Route path='/' element={<Home/>}/> 
            <Route path='/productos' element={<Productos/>}/>
            <Route path='/contacto' element={<Contacto/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route
              path="/perfil"
              element={
                <RutaProtegida>
                  <Profile />
                </RutaProtegida>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RutaProtegida>
                  <Dashboard />
                </RutaProtegida>
              }
            />
          </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  )
}

export default App
