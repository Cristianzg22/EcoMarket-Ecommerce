import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; 
import { Container, Nav, Navbar, Button, ButtonGroup, Offcanvas } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";  
import { toast } from 'react-toastify';

const MyNavbar = () => {
  const { currentUser, logout, isAdmin } = useAuth(); 
  const [loading, setLoading] = useState(false); 

  async function handleLogout() {
    setLoading(true); 

    try {
      await logout(); 
      window.location.reload(); 
      toast.success("¡Cierre de sesión exitoso!"); 
    } catch (error) {
      toast.error("Error al cerrar sesión"); 
    }
    setLoading(false); 
  }

  const [offcanvasOpen, setOffcanvasOpen] = useState(false); 

  const toggleOffcanvas = () => {
    setOffcanvasOpen(!offcanvasOpen); 
  };

  const handleCloseOffcanvas = () => {
    setOffcanvasOpen(false); 
  };

  const authButton = () => {
    if (!currentUser) { 
      return (
        <>            
          <ButtonGroup>
            <Button variant="light" as={NavLink} to="/login" onClick={handleCloseOffcanvas}>Iniciar Sesión</Button>
            <Button variant="light" as={NavLink} to="/register" onClick={handleCloseOffcanvas}>Registrarse</Button>
          </ButtonGroup>
        </>
      )
    } else { 
      return (
        <>
          <Nav.Link className="me-3" as={NavLink} to="/order" onClick={handleCloseOffcanvas}>
            Pedidos
          </Nav.Link>
          <Nav.Link className="me-3" as={NavLink} to="/cart" onClick={handleCloseOffcanvas}>
            Carrito
          </Nav.Link>
          {isAdmin ? ( 
            <Nav.Link className="mb-2 mb-lg-0 me-3" as={NavLink} to="/admin/addproduct" onClick={handleCloseOffcanvas}>
              Administrador
            </Nav.Link>
          ) : null}
          <Button disabled={loading} variant="light" onClick={() => { handleLogout(); handleCloseOffcanvas(); }}> Cerrar Sesión </Button>
        </>
      )
    }
  }

  return (
    <Navbar expand="lg" bg="dark" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" onClick={handleCloseOffcanvas} className="fw-bold fs-2">
          <span className="text-warning">Eco</span>Market
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" onClick={toggleOffcanvas}/>
        <Navbar.Offcanvas 
          id="offcanvasNavbar-expand-lg" 
          aria-labelledby="offnvasNavbarLabel-expand-lg" 
          placement="end" 
          bg="dark" 
          variant="dark" 
          show={offcanvasOpen} 
          onHide={handleCloseOffcanvas} 
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offnvasNavbarLabel-expand-lg"> EcoMarket </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">            
              <Nav.Link className='me-2' as={NavLink} to="/" onClick={handleCloseOffcanvas}> Inicio </Nav.Link>
              <Nav.Link as={NavLink} to="/sale" onClick={handleCloseOffcanvas} style={{ color: 'orange' }}> 
                <strong>Ofertas</strong> 
              </Nav.Link>
              <Nav.Link>
              <a
  href={`https://wa.me/${+573007270698}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src="https://img.icons8.com/?size=100&id=16712&format=png&color=FCC419"
    alt="WhatsApp"
    width="30"
    height="30"
    style={{ filter: 'none', backgroundColor: 'transparent' }}
  />
</a>
              </Nav.Link>
            </Nav>
            <Nav>
              {authButton()}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}

export default MyNavbar;