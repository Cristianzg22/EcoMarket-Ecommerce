import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom"

// API de Contexto
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from './context/ProductContext';

// Se crea la raíz de la aplicación React en el DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación dentro del StrictMode, que ayuda a identificar posibles problemas
root.render(
  <React.StrictMode>
      {/* Envolvemos la aplicación en BrowserRouter para habilitar la navegación con React Router */}
      <BrowserRouter>
        {/* AuthProvider proporciona el contexto de autenticación a toda la aplicación */}
        <AuthProvider>
          {/* ProductProvider proporciona el contexto de productos a toda la aplicación */}
          <ProductProvider >
            {/* Componente principal de la aplicación */}
            <App />
          </ProductProvider>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);
