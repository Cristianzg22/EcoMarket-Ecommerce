import { Navigate } from "react-router-dom"; // Importar el componente Navigate para redirigir a otras rutas

// Contexto de autenticación
import { useAuth } from "../context/AuthContext"; // Importar el contexto de autenticación para acceder a información de usuario

const AdminRoute = ({ children }) => {
    const { isAdmin, loading, currentUser } = useAuth(); // Extraer isAdmin, loading y currentUser del contexto de autenticación

    // Si la información de autenticación está cargando, se muestra un mensaje de carga
    if (loading) {
        return <span>....</span>; // Se puede personalizar este mensaje de carga
    }

    // Si el usuario es un administrador, se renderiza el contenido hijo (children)
    if (isAdmin) {
        console.log('currentUser: ', currentUser); // Muestra en la consola la información del usuario actual
        return children; // Renderiza los componentes hijos (las rutas protegidas)
    }

    // Si no es un administrador, redirige al usuario a la página de inicio de sesión
    return <Navigate to="/login" />;
};

export default AdminRoute; // Exportar el componente AdminRoute para su uso en otras partes de la aplicación
