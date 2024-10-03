import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Button, ButtonGroup, Offcanvas } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";  
import { toast } from 'react-toastify';

const MyNavbar = () => {
  const navigate = useNavigate(); // Hook para navegar entre rutas

  const { currentUser, logout, isAdmin } = useAuth(); // Extrae el usuario actual, la función de cierre de sesión y el estado de administrador del contexto
  const [loading, setLoading] = useState(false); // Estado para manejar la carga durante el cierre de sesión

  async function handleLogout() {
    setLoading(true); // Indica que se está procesando el cierre de sesión

    try {
      await logout(); // Llama a la función de cierre de sesión
      navigate("/"); // Redirige a la página principal
      toast.success("Successfully Logout !"); // Mensaje de éxito

    } catch (error) {
      toast.error("Failed to Logout"); // Mensaje de error
    }
    setLoading(false); // Restablece el estado de carga
  }

  const [offcanvasOpen, setOffcanvasOpen] = useState(false); // Estado para rastrear la apertura/cierre del menú offcanvas

  const toggleOffcanvas = () => {
    setOffcanvasOpen(!offcanvasOpen); // Alterna el estado cuando se llama
  };

  // Función para cerrar el offcanvas cuando se hace clic en un enlace
  const handleCloseOffcanvas = () => {
    setOffcanvasOpen(false); // Cierra el menú offcanvas
  };

  // Función para renderizar botones de autenticación
  const authButton = () => {
    if (!currentUser) { // Si el usuario no está autenticado
      return (
        <>            
          <ButtonGroup>
            <Button variant="light" as={NavLink} to="/login" onClick={handleCloseOffcanvas}>Login</Button>
            <Button variant="light" as={NavLink} to="/register" onClick={handleCloseOffcanvas}>Signup</Button>
          </ButtonGroup>
        </>
      )
    } else { // Si el usuario está autenticado
      return (
        <>
          <Nav.Link className="me-3" as={NavLink} to="/order" onClick={handleCloseOffcanvas}>
            Order
          </Nav.Link>
          <Nav.Link className="me-3" as={NavLink} to="/cart" onClick={handleCloseOffcanvas}>
            Cart
          </Nav.Link>

          {isAdmin ? ( // Si el usuario es administrador
            <Nav.Link className="mb-2 mb-lg-0 me-3" as={NavLink} to="/admin/addproduct" onClick={handleCloseOffcanvas}>
              Admin
            </Nav.Link>
          ) : null}

          <Button disabled={loading} variant="light" onClick={() => { handleLogout(); handleCloseOffcanvas(); }}> Logout </Button>
        </>
      )
    }
  }

  return (
    <Navbar expand="lg" bg="primary" data-bs-theme="dark" fixed="top">
      <Container>

        <Navbar.Brand as={NavLink} to="/" onClick={handleCloseOffcanvas}>
          BuyBusy
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" onClick={toggleOffcanvas}/>

        <Navbar.Offcanvas 
          id="offcanvasNavbar-expand-lg" 
          aria-labelledby="offnvasNavbarLabel-expand-lg" 
          placement="end" 
          bg="primary" 
          data-bs-theme="dark" 
          show={offcanvasOpen} 
          onHide={handleCloseOffcanvas} 
        >

          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offnvasNavbarLabel-expand-lg"> BuyBusy </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">            
              <Nav.Link as={NavLink} to="/" onClick={handleCloseOffcanvas}> Home </Nav.Link>
            </Nav>

            
            <Nav>
              {/* // Llama a la función para renderizar botones de autenticación */}
              {authButton()}
            </Nav>
          </Offcanvas.Body>

        </Navbar.Offcanvas>
        
      </Container>
    </Navbar>
  )
}

export default MyNavbar;
