import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// CSS
import { Button } from 'react-bootstrap';

const NoPage = () => {

  // useNavigate permite la navegación programática en React Router
  const navigate = useNavigate();
  
  // useEffect para redirigir a la página de inicio después de 2 segundos
  useEffect(() => {
    setTimeout(() => {
      navigate('/');  // Redirige a la página de inicio
    }, 2000);
  }, [navigate]);  // Se asegura de que el efecto dependa de la función navigate

  return (
    <>
      {/* Contenedor de la página de error 404 */}
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          {/* Código de error 404 */}
          <h1 className="display-1 fw-bold">404</h1>
          
          {/* Mensaje de error */}
          <p className="fs-3"> 
            <span className="text-danger">Oops!</span> Page not found.
          </p>
          
          {/* Texto adicional */}
          <p className="lead">
            The page you’re looking for doesn’t exist.
          </p>
          
          {/* Botón para regresar a la página de inicio */}
          <Button as={NavLink} to="/" className="btn btn-primary"> 
            Go Home 
          </Button>
        </div>
      </div>
    </>
  )
}

export default NoPage;
