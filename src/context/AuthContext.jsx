import React, { createContext, useContext, useState, useEffect } from "react";

// Firebase
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebaseInit";

// Crear el Contexto
const AuthContext = createContext();

// Crear el Proveedor
export const AuthProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(); // Estado para el usuario actual
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si el usuario es administrador
  const [loading, setLoading] = useState(false); // Estado para controlar la carga de la autenticación

  // Registro con Email y Contraseña
  const registerWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Iniciar sesión con Email y Contraseña
  const logInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Iniciar sesión con Google
  const signInWithGoogle = async () => {
    return signInWithPopup(auth, googleProvider);
  };
  
  // Restablecer la contraseña
  const resetPassword = async (email) => {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email);
  };

  // Cerrar sesión
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    setLoading(true); // Comienza a cargar
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user); // Actualiza el usuario actual
      
      // Verifica si el usuario es administrador
      if(user && (user.email === 'deqstop666@gmail.com')){
        setIsAdmin(true);
      }
      
      setLoading(false); // Finaliza la carga
    });

    return unsubscribe; // Devuelve la función para desuscribirse del listener
  }, []);

  return (
    <AuthContext.Provider 
      value={{
        registerWithEmailAndPassword,
        logInWithEmailAndPassword,
        logout,
        currentUser,
        resetPassword,
        isAdmin,
        signInWithGoogle
      }}
    >
      {!loading && props.children} {/* Muestra los hijos solo si no está cargando */}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = () => useContext(AuthContext);
