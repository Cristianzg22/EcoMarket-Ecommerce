// Bootstrap: Importamos los estilos de Bootstrap para utilizarlos en toda la aplicación
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';

// Páginas: Importamos las diferentes páginas que serán usadas en las rutas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/admin/AddProduct';
import Cart from './pages/Cart';
import Order from './pages/Order';
import ForgetPassword from './pages/ForgetPassword';
import NoPage from './pages/NoPage';

// React Toastify: Biblioteca para mostrar notificaciones de forma rápida y sencilla
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

// Componentes: Importamos componentes reutilizables
import MyNavbar from './components/MyNavbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {

  return (
    <>
      {/* Configuración del contenedor de notificaciones Toastify */}
      <ToastContainer
        position="bottom-center" // Posición de las notificaciones
        autoClose={2000} // Tiempo de cierre automático (en milisegundos)
        hideProgressBar={false} // Mostrar barra de progreso
        newestOnTop={false} // Las notificaciones nuevas no se apilan arriba
        closeOnClick // Cerrar al hacer clic
        rtl={false} // No usar diseño de derecha a izquierda
        pauseOnFocusLoss // Pausar al perder el foco de la ventana
        draggable // Hacer las notificaciones arrastrables
        pauseOnHover={false} // No pausar cuando el ratón está sobre la notificación
        theme="colored" // Usar un tema de color para las notificaciones
        transition={Slide} // Efecto de transición al aparecer la notificación
      />

      {/* Componente de barra de navegación */}
      <MyNavbar/>

      {/* Definición de rutas de la aplicación */}
      <Routes>
        {/* Ruta para la página principal */}
        <Route exact path="/" element= {<Home />} />
        {/* Ruta para la página de "Olvidé mi contraseña" */}
        <Route path="/forgetpassword" element ={<ForgetPassword />} />
        {/* Ruta para la página de inicio de sesión */}
        <Route path="/login" element= {<Login />} />
        {/* Ruta para la página de registro */}
        <Route path="/register" element= { <Register /> } />

        {/* Ruta protegida para agregar un producto (solo accesible por administradores) */}
        <Route path="/admin/addProduct" element={
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        } />

        {/* Ruta protegida para la página de pedidos (solo usuarios autenticados) */}
        <Route path="/order" element={
          <PrivateRoute>
            <Order />
          </PrivateRoute>
        } />

        {/* Ruta protegida para el carrito de compras (solo usuarios autenticados) */}
        <Route path="/cart" element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } />

        {/* Ruta para manejar páginas no encontradas */}
        <Route path="/*" element={<NoPage />} />
      </Routes>    
    </>
  );
}

export default App;
