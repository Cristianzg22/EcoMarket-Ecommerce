// Importar las funciones necesarias de los SDKs que necesitas
import { initializeApp } from "firebase/app"; // Para inicializar la aplicación de Firebase
import { getFirestore } from "firebase/firestore"; // Para trabajar con Firestore (base de datos en tiempo real)
import { getStorage } from "firebase/storage"; // Para trabajar con Firebase Storage (almacenamiento de archivos)
import { getAnalytics } from "firebase/analytics"; // Para trabajar con Firebase Analytics
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Para trabajar con la autenticación de Firebase y el proveedor de Google

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyADqFq-z_2000sCYN59outR0Ljm1BXc9co", // Clave API de Firebase
  authDomain: "ecommerce-app-20dd3.firebaseapp.com", // Dominio de autenticación
  projectId: "ecommerce-app-20dd3", // ID del proyecto de Firebase
  storageBucket: "ecommerce-app-20dd3.appspot.com", // Bucket de almacenamiento
  messagingSenderId: "975940529069", // ID del remitente de mensajes
  appId: "1:975940529069:web:af8ec83ef0620bf3314f24", // ID de la aplicación
  measurementId: "G-XYMXVWWY08" // ID de medición

};

// Inicializar Firebase
const app = initializeApp(firebaseConfig); // Crea la instancia de la aplicación Firebase

// Instancia de autenticación de Firebase
const auth = getAuth(app); // Inicializa la autenticación de Firebase

// Inicializar Cloud Firestore y obtener una referencia al servicio
const db = getFirestore(app); // Crea la instancia de Firestore

// Instancia del objeto proveedor de Google
const googleProvider = new GoogleAuthProvider(); // Crea una instancia del proveedor de Google para la autenticación

// Inicializar Cloud Storage y obtener una referencia al servicio
const storage = getStorage(app); // Crea la instancia de Firebase Storage

// Inicializa Firebase Analytics
const analytics = getAnalytics(app);

// Exportar las instancias para su uso en otras partes de la aplicación
export { auth, db, storage, googleProvider };
