import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";

// CSS
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";

// Contexto API
import { useAuth } from '../context/AuthContext';

// React Toastify (para notificaciones)
import { toast } from 'react-toastify';

const Register = () => {
  // Se extraen las funciones y el estado actual del usuario del contexto de autenticación
  const { registerWithEmailAndPassword, currentUser } = useAuth();
  const navigate = useNavigate();

  // Estados locales para el email, contraseña y estado de carga
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);  // Se indica que el registro está en proceso

    try {
      // Se llama a la función del contexto para registrar al usuario con email y contraseña
      await registerWithEmailAndPassword(email, password);
      navigate("/");  // Redirige a la página principal después del registro exitoso
      toast.success('¡Registro exitoso!');  // Muestra notificación de éxito

    } catch (err) {
      // En caso de error, se muestra una notificación de fallo
      toast.error("Error al crear la cuenta");
    }

    setLoading(false);  // Finaliza el estado de carga

    // Limpia los campos de email y contraseña
    setEmail("");
    setPassword("");
  }

  // Hook useEffect que redirige al usuario a la página principal si ya está autenticado
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  });

  return (
    <div>
      <Container>
        {/* Filas y columnas para posicionar el formulario en el centro de la pantalla */}
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            {/* Decoración del borde */}
            <div className="border border-3 border-primary"></div>

            {/* Tarjeta que contiene el formulario de registro */}
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-uppercase">Registro</h2>
                  <p className=" mb-5">¡Por favor ingresa tu nombre, email y contraseña!</p>

                  <div className="mb-3">

                    {/* Formulario controlado */}
                    <Form onSubmit={handleSubmit}>

                      {/* Campo para el email */}
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" 
                            placeholder="Ingresa tu correo"
                            required
                        />
                      </Form.Group>

                      {/* Campo para la contraseña */}
                      <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Contraseña</Form.Label>
                          <Form.Control
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              type="password" 
                              placeholder="Contraseña"
                              required
                          />
                      </Form.Group>

                      {/* Botón de registro */}
                      <div className="d-grid">
                        <Button variant="primary" type="submit" disabled={loading}>
                          Registrar
                        </Button>
                      </div>

                    </Form>

                    {/* Enlace para redirigir al usuario al inicio de sesión si ya tiene una cuenta */}
                    <div className="mt-3">
                      <p className="mb-0 text-center">
                        ¿Ya tienes una cuenta?{" "}
                        <NavLink to="/login" className="text-primary fw-bold">
                          Iniciar Sesión
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
    </div>
  )
}

export default Register;
