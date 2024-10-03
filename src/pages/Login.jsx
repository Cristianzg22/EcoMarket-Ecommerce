import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";

// CSS: Importamos los componentes de Bootstrap
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";

// API de contexto: Importamos las funciones de autenticación
import { useAuth } from '../context/AuthContext';

// Notificaciones: Importamos react-toastify para mostrar mensajes
import { toast } from 'react-toastify';

const Login = () => {
  // Extraemos las funciones de login del contexto de autenticación
  const { logInWithEmailAndPassword, currentUser, signInWithGoogle } = useAuth();
  
  // useNavigate nos permite redirigir al usuario a diferentes rutas
  const navigate = useNavigate();
  
  // Definimos los estados para manejar email, contraseña y estado de carga
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Función que se ejecuta cuando se envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevenimos el comportamiento por defecto del formulario
    
    setLoading(true);  // Establecemos el estado de carga en verdadero
    try {
      await logInWithEmailAndPassword(email, password);  // Intentamos iniciar sesión con email y contraseña
      navigate("/");  // Redirigimos al usuario a la página de inicio
      toast.success('Successfully Login !');  // Mostramos un mensaje de éxito
      
    } catch (err) {
      toast.error('Failed to log in!');  // Mostramos un mensaje de error
    }

    setLoading(false);  // Cambiamos el estado de carga a falso
    setEmail("");  // Reseteamos el campo de email
    setPassword("");  // Reseteamos el campo de contraseña
  }

  // Función que maneja el login con Google
  const signInWithGoogleHandle = async () => {
    setLoading(true);  // Establecemos el estado de carga en verdadero
    
    try {
      await signInWithGoogle();  // Intentamos iniciar sesión con Google
      navigate("/");  // Redirigimos al usuario a la página de inicio
      toast.success('Successfully Login !');  // Mostramos un mensaje de éxito

    } catch(error) {
      toast.error('Failed to log in!');  // Mostramos un mensaje de error     
    }

    setLoading(false);  // Cambiamos el estado de carga a falso
  } 

   // Redirigir al usuario a la página de inicio si ya está autenticado
   useEffect(() => {
    if (currentUser) {
      navigate("/");  // Redirección a la página de inicio si ya está autenticado
    }
   })

  return (
    <div>
      <Container>
        {/* Contenedor de fila y columna para centrar el formulario */}
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            {/* Estilo adicional para la tarjeta de inicio de sesión */}
            <div className="border border-3 border-primary"></div>

            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-uppercase ">Login</h2>
                  <p className=" mb-5">Please enter your login email and password!</p>

                  <div className="mb-3">

                    {/* Formulario para manejar el login */}
                    <Form onSubmit={handleSubmit}>
                      {/* Campo para ingresar el email */}
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" 
                            placeholder="Enter email"
                            required
                        />
                      </Form.Group>

                      {/* Campo para ingresar la contraseña */}
                      <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              type="password" 
                              placeholder="Password"
                              required 
                          />
                      </Form.Group>
                    
                      {/* Enlace para olvidar contraseña */}
                      <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <p className="small">
                          <NavLink className="text-primary" to="/forgetpassword">
                            Forgot password?
                          </NavLink>
                        </p>
                      </Form.Group>
                      
                      {/* Botón para iniciar sesión */}
                      <div className="d-grid">
                        <Button className="mb-3" variant="primary" type="submit" disabled={loading}>
                          Login
                        </Button>

                        {/* Botón para iniciar sesión con Google */}
                        <Button variant="danger" onClick={signInWithGoogleHandle} disabled={loading}>
                          Sign in With Google
                        </Button>
                      </div>

                    </Form>

                    {/* Enlace para registrarse si no tiene una cuenta */}
                    <div className="mt-3">
                      <p className="mb-0 text-center">
                        Don't have an account?{" "}
                        <NavLink to="/register" className="text-primary fw-bold">
                          Sign Up
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

export default Login;
