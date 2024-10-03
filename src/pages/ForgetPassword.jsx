import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// CSS: Importamos componentes de React Bootstrap
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";

// API de Contexto: Importamos el contexto de autenticación
import { useAuth } from "../context/AuthContext";

// React Toastify: Biblioteca para mostrar notificaciones de forma rápida y sencilla
import { toast } from 'react-toastify';

export default function ForgotPassword() {

  // Extraemos la función resetPassword del contexto de autenticación
  const { resetPassword } = useAuth();
  const navigate = useNavigate(); // Hook para la navegación
  const [email, setEmail] = useState(""); // Estado para almacenar el correo electrónico
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  // Función que maneja el envío del formulario
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // Activar el estado de carga
    try {
      await resetPassword(email); // Intentar enviar la solicitud de restablecimiento
      toast.success("¡Revisa tu bandeja de entrada para más instrucciones!"); // Mostrar éxito
      navigate("/"); // Redirigir a la página principal
    } catch {
      toast.error("No se pudo restablecer la contraseña"); // Mostrar error
    }
    setLoading(false); // Desactivar el estado de carga
    setEmail(""); // Limpiar el campo de email
  }

  return (
    <>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <div className="border border-3 border-primary"></div>

            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  {/* Título */}
                  <h2 className="fw-bold mb-2 text-uppercase ">Restablecer Contraseña</h2>
                  <p className=" mb-5">Por favor, ingresa tu correo electrónico de inicio de sesión</p>

                  <div className="mb-3">
                    {/* Formulario de restablecimiento */}
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" 
                            placeholder="Ingresa tu correo"
                            required
                        />
                      </Form.Group>

                      {/* Enlace para volver a la página de inicio de sesión */}
                      <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <p className="small">
                          <NavLink className="text-primary" to="/login">
                            ¿Iniciar sesión?
                          </NavLink>
                        </p>
                      </Form.Group>

                      {/* Botón para enviar la solicitud */}
                      <div className="d-grid">
                        <Button variant="primary" type="submit" disabled={loading}>
                          Restablecer Contraseña
                        </Button>
                      </div>
                    </Form>

                    {/* Enlace para crear una nueva cuenta */}
                    <div className="mt-3">
                      <p className="mb-0 text-center">
                        ¿Necesitas una cuenta?{" "}
                        <NavLink to="/register" className="text-primary fw-bold">
                          Regístrate
                        </NavLink>
                      </p>
                    </div>

                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
