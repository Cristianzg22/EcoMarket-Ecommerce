import React, { createContext, useContext, useState, useEffect } from "react";

// Firebase
import {
  collection,
  addDoc,
  query,
  orderBy, // Importar orderBy para ordenar los productos
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  increment,
  getDocs,
  writeBatch,
} from "firebase/firestore";

import { db } from "../config/firebaseInit";

// React Toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context API
import { useAuth } from "./AuthContext";

// 1er Paso -> Crear el Contexto
const ProductContext = createContext();

// 2do Paso -> Crear el Proveedor
const ProductProvider = (props) => {
  const [products, setProduct] = useState([]); // Estado para los productos
  const [productLoading, setProductLoading] = useState(false); // Estado para controlar la carga de productos
  const [minPrice, setMinPrice] = useState(0); // Estado para el precio mínimo
  const [maxPrice, setMaxPrice] = useState(0); // Estado para el precio máximo

  const { currentUser } = useAuth(); // Obtener el usuario actual del contexto de autenticación
  const [addRemovecartLoading, setAddRemoveCartLoading] = useState(false); // Estado para controlar la carga al agregar o eliminar del carrito
  const [userCart, setuserCart] = useState([]); // Estado para el carrito del usuario
  const [userOrder, setUserOrder] = useState([]); // Estado para las órdenes del usuario

  /********** Calcular los precios mínimo y máximo **********/
  useEffect(() => {
    const calculateMinMaxPrices = () => {
      const prices = products.map((item) => item.price);
      setMinPrice(Math.min(...prices)); // Establecer el precio mínimo
      setMaxPrice(Math.max(...prices)); // Establecer el precio máximo
    };

    if (products.length > 0) {
      calculateMinMaxPrices(); // Calcular precios si hay productos
    }
  }, [products]); // Añadir products como dependencia para evitar bucles infinitos

  // Obtener la fecha actual
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();

  /********** Agregar un nuevo producto a la base de datos **********/
  const handleCreateNewListing = async (name, category, price, imageURL) => {
    setProductLoading(true); // Comenzar a cargar

    try {
      await addDoc(collection(db, "products"), {
        name,
        category,
        price: Number(price), // Asegurarse de que el precio sea un número
        imageURL,
        addedDate: currentDate, // Almacenar la fecha de adición
      });
      toast.success("Producto agregado exitosamente");
    } catch (error) {
      toast.error("Error al agregar el producto");
      console.log(error);
    }
    setProductLoading(false); // Finalizar la carga
  };

  /********** Obtener todos los productos de la base de datos **********/
  const getAllProduct = async () => {
    setProductLoading(true); // Comenzar a cargar

    try {
      const collectionRef = collection(db, "products");

      const q = query(
        collectionRef,
        orderBy("addedDate", "desc") // Ordenar por fecha de adición en orden descendente
      );

      // Base de datos en tiempo real
      onSnapshot(q, (querySnapshot) => {
        const productArray = [];
        querySnapshot.forEach((doc) => {
          productArray.push({ ...doc.data(), id: doc.id });
        });

        setProduct(productArray); // Actualizar el estado de productos
      });
    } catch (err) {
      console.log(err);
    }

    setProductLoading(false); // Finalizar la carga
  };

  useEffect(() => {
    getAllProduct(); // Llamar a la función para obtener todos los productos
  }, []);

  /********** Obtener el carrito del usuario **********/
  const getUserCart = async () => {
    setProductLoading(true); // Comenzar a cargar
    try {
      const cartCollectionRef = collection(db, `usersCarts/${currentUser.uid}/myCart`);

      onSnapshot(cartCollectionRef, (querySnapshot) => {
        const cart = [];
        querySnapshot.forEach((doc) => {
          cart.push({ id: doc.id, ...doc.data() });
        });

        setuserCart(cart); // Actualizar el carrito con datos en tiempo real
      });
    } catch (error) {
      toast.error("Error al obtener el carrito del usuario");
      console.error("Error al obtener el carrito del usuario:", error);
      return [];
    }
    setProductLoading(false); // Finalizar la carga
  };

  /********** Agregar al Carrito **********/
  const handleAdd = async (product) => {
    setAddRemoveCartLoading(true); // Comenzar a cargar

    // Base de datos
    try {
      if (!currentUser) {
        setAddRemoveCartLoading(false);
        toast.error("¡Por favor, inicie sesión!");
        return;
      }

      // Verificar si el producto ya está en el carrito
      const cartDocRef = doc(
        db,
        `usersCarts/${currentUser.uid}/myCart`,
        product.id
      );
      const cartDocSnapshot = await getDoc(cartDocRef);

      if (cartDocSnapshot.exists()) {
        // Si el producto ya está en el carrito, actualizar su cantidad
        await setDoc(
          cartDocRef,
          {
            quantity: increment(1), // Incrementar la cantidad
          },
          { merge: true }
        );
        toast.success("Producto incrementado en 1");

      } else {
        // Si el producto no está en el carrito, agregarlo con una cantidad de 1
        await setDoc(cartDocRef, {
          quantity: 1,
          ...product, // Incluir todo el objeto del producto
        });
        toast.success("Producto agregado al carrito");
      }
    } catch (error) {
      toast.error("Error al agregar el producto al carrito");
    }
    setAddRemoveCartLoading(false); // Finalizar la carga
  };

  /********** Manejar la eliminación del carrito **********/
  const handleRemove = async (productId) => {
    setAddRemoveCartLoading(true); // Comenzar a cargar
    try {
      if (!currentUser) {
        // Manejar el caso donde currentUser o currentUser.uid no está definido
        setAddRemoveCartLoading(false);
        return;
      }

      // Buscar el producto en el carrito
      const cartDocRef = doc(db, `usersCarts/${currentUser.uid}/myCart`, productId);

      const cartDocsSnapshot = await getDoc(cartDocRef);

      if (cartDocsSnapshot.exists()) {
        const currentQuantity = cartDocsSnapshot.data().quantity;

        if (currentQuantity > 1) {
          // Si la cantidad del producto es mayor que 1, disminuir su cantidad
          await setDoc(cartDocRef, { quantity: increment(-1) }, { merge: true });
          toast.success("Producto disminuido en 1");
        } else {
          // Si la cantidad del producto es 1, eliminarlo del carrito
          await deleteDoc(cartDocRef);
          toast.success("Producto eliminado del carrito");
        }
      }
    } catch (error) {
      toast.error("Error al eliminar el producto del carrito");
    }
    setAddRemoveCartLoading(false); // Finalizar la carga
  };

  const TotalCart = (userOrder) => {
    return userOrder.reduce(
      (total, product) => total + product.price * product.quantity, // Calcular el total del carrito
      0
    );
  };

  /********** Realizar un pedido **********/
  const placeOrder = async () => {
    setProductLoading(true); // Comenzar a cargar
    try {
      let orderDate = date.toString() + "-" + month.toString() + "-" + year.toString();
      let newOrder = { userCart, orderDate };
      const ordersCollectionRef = collection(
        db,
        `userOrders/${currentUser.uid}/orders`
      );
      await setDoc(doc(ordersCollectionRef), newOrder);

      // Limpiar el carrito del usuario en la subcolección "carts"
      const cartCollectionRef = collection(
        db,
        `usersCarts/${currentUser.uid}/myCart`
      );
      const cartQuerySnapshot = await getDocs(cartCollectionRef);
      const batch = writeBatch(db);

      cartQuerySnapshot.forEach((doc) => {
        batch.delete(doc.ref); // Eliminar todos los documentos en el carrito
      });

      await batch.commit(); // Realizar la escritura por lotes
      setuserCart([]); // Limpiar el estado del carrito

      toast.success("Pedido realizado exitosamente!");
    } catch (error) {
      toast.error("Error al realizar el pedido!");
      console.error("Error al realizar el pedido:", error);
    }
    setProductLoading(false); // Finalizar la carga
  };

  /********** Obtener historial de pedidos del usuario **********/
  const getUserOrderHistory = async () => {
    setProductLoading(true); // Comenzar a cargar
    try {
      const ordersCollectionRef = collection(
        db,
        `userOrders/${currentUser.uid}/orders`
      );

      // Base de datos en tiempo real
      const q = query(
        ordersCollectionRef,
        orderBy("orderDate", "desc") // Ordenar por fecha de pedido en orden descendente
      );
      onSnapshot(q, (querySnapshot) => {
        const orderHistory = [];

        querySnapshot.forEach((doc) => {
          orderHistory.push({ id: doc.id, ...doc.data() });
        });
        setUserOrder(orderHistory); // Actualizar el estado del historial de pedidos
      });
    } catch (error) {
      console.log("Error en el historial de pedidos!!", error);
    }
    setProductLoading(false); // Finalizar la carga
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        productLoading,
        handleCreateNewListing,
        minPrice,
        maxPrice,
        handleAdd,
        handleRemove,
        userCart,
        getUserCart,
        TotalCart,
        addRemovecartLoading,
        placeOrder,
        getUserOrderHistory,
        userOrder,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

// 3er Paso -> Hook Personalizado
const useProduct = () => useContext(ProductContext);

export { ProductProvider, useProduct };
