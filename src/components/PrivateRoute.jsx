import { Navigate } from "react-router-dom";

// Context API
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { loading, currentUser } = useAuth(); // Extrae el estado de carga y el usuario actual del contexto

  if (loading) { // Si los datos aún se están cargando
    return <span>....</span>; // Muestra un indicador de carga
  }

  if (currentUser) { // Si el usuario está autenticado
    return children; // Renderiza los hijos (componentes protegidos)
  }

  return <Navigate to="/login" />; // Redirige al usuario a la página de inicio de sesión si no está autenticado
};

export default PrivateRoute;
