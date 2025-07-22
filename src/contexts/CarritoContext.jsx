import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';


const CarritoContext = createContext();


const ACTIONS = {
  AGREGAR_PRODUCTO: 'AGREGAR_PRODUCTO',
  ELIMINAR_PRODUCTO: 'ELIMINAR_PRODUCTO',
  ACTUALIZAR_CANTIDAD: 'ACTUALIZAR_CANTIDAD',
  VACIAR_CARRITO: 'VACIAR_CARRITO',
  CARGAR_CARRITO: 'CARGAR_CARRITO'
};


const carritoReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.AGREGAR_PRODUCTO: {
      const { producto } = action.payload;
      const productoExistente = state.productos.find(item => item.id === producto.id);
      
      if (productoExistente) {
        
        return {
          ...state,
          productos: state.productos.map(item =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        };
      } else {
        
        return {
          ...state,
          productos: [...state.productos, { ...producto, cantidad: 1 }]
        };
      }
    }

    case ACTIONS.ELIMINAR_PRODUCTO: {
      const { id } = action.payload;
      return {
        ...state,
        productos: state.productos.filter(item => item.id !== id)
      };
    }

    case ACTIONS.ACTUALIZAR_CANTIDAD: {
      const { id, cantidad } = action.payload;
      if (cantidad <= 0) {
        return {
          ...state,
          productos: state.productos.filter(item => item.id !== id)
        };
      }
      
      return {
        ...state,
        productos: state.productos.map(item =>
          item.id === id ? { ...item, cantidad } : item
        )
      };
    }

    case ACTIONS.VACIAR_CARRITO: {
      return {
        ...state,
        productos: []
      };
    }

    case ACTIONS.CARGAR_CARRITO: {
      return {
        ...state,
        productos: action.payload.productos || []
      };
    }

    default:
      return state;
  }
};

const estadoInicial = {
  productos: []
};

export const CarritoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carritoReducer, estadoInicial);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        const productos = JSON.parse(carritoGuardado);
        dispatch({
          type: ACTIONS.CARGAR_CARRITO,
          payload: { productos }
        });
      } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('carrito', JSON.stringify(state.productos));
    }
  }, [state.productos, isLoaded]);


  const agregarProducto = (producto) => {
    dispatch({
      type: ACTIONS.AGREGAR_PRODUCTO,
      payload: { producto }
    });
  };

  const eliminarProducto = (id) => {
    dispatch({
      type: ACTIONS.ELIMINAR_PRODUCTO,
      payload: { id }
    });
  };

  const actualizarCantidad = (id, cantidad) => {
    dispatch({
      type: ACTIONS.ACTUALIZAR_CANTIDAD,
      payload: { id, cantidad }
    });
  };

  const vaciarCarrito = () => {
    dispatch({
      type: ACTIONS.VACIAR_CARRITO
    });
  };


  const cantidadTotal = state.productos.reduce((total, item) => total + item.cantidad, 0);
  
  const precioTotal = state.productos.reduce((total, item) => {
    return total + (item.price * item.cantidad);
  }, 0);

  const estaEnCarrito = (id) => {
    return state.productos.some(item => item.id === id);
  };

  const obtenerCantidadProducto = (id) => {
    const producto = state.productos.find(item => item.id === id);
    return producto ? producto.cantidad : 0;
  };

  const value = {
    productos: state.productos,
    cantidadTotal,
    precioTotal,
    agregarProducto,
    eliminarProducto,
    actualizarCantidad,
    vaciarCarrito,
    estaEnCarrito,
    obtenerCantidadProducto
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
  }
  return context;
};

export default CarritoContext;