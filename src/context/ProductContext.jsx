import React, { createContext, useContext, useState, useEffect } from "react";

// Firebase
import {
  collection,
  addDoc,
  query,
  orderBy,
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
  const [products, setProduct] = useState([]); 
  const [productLoading, setProductLoading] = useState(false); 
  const [minPrice, setMinPrice] = useState(0); 
  const [maxPrice, setMaxPrice] = useState(0); 

  const { currentUser } = useAuth(); 
  const [addRemovecartLoading, setAddRemoveCartLoading] = useState(false); 
  const [userCart, setUserCart] = useState([]); 
  const [userOrder, setUserOrder] = useState([]); 

  /********** Calcular los precios mínimo y máximo **********/
  useEffect(() => {
    const calculateMinMaxPrices = () => {
      if (products.length > 0) {
        const prices = products.map((item) => item.price);
        setMinPrice(Math.min(...prices)); 
        setMaxPrice(Math.max(...prices)); 
      }
    };

    calculateMinMaxPrices(); 
  }, [products]); 

  /********** Agregar un nuevo producto a la base de datos **********/
  const handleCreateNewListing = async (name, category, price, imageURL) => {
    setProductLoading(true); 

    try {
      await addDoc(collection(db, "products"), {
        name,
        category,
        price: Number(price), 
        imageURL,
        addedDate: new Date(), // Almacenar la fecha de adición
      });
      toast.success("Producto agregado exitosamente");
    } catch (error) {
      toast.error("Error al agregar el producto");
      console.log(error);
    }
    setProductLoading(false); 
  };

  /********** Obtener todos los productos de la base de datos **********/
  const getAllProduct = async () => {
    setProductLoading(true); 

    try {
      const collectionRef = collection(db, "products");
      const q = query(collectionRef, orderBy("addedDate", "desc")); 

      onSnapshot(q, (querySnapshot) => {
        const productArray = [];
        querySnapshot.forEach((doc) => {
          productArray.push({ ...doc.data(), id: doc.id });
        });
        setProduct(productArray); 
      });
    } catch (err) {
      console.log(err);
    }

    setProductLoading(false); 
  };

  useEffect(() => {
    getAllProduct(); 
  }, []);

  // Actualizar un producto
  const handleUpdateProduct = async (id, name, category, price, imageURL, discount) => {
    setProductLoading(true);
    try {
      const productRef = doc(db, "products", id);
      await setDoc(productRef, {
        name,
        category,
        price: Number(price),
        imageURL,
        discount,
        addedDate: new Date(),
      });
      toast.success("Producto actualizado exitosamente");
    } catch (error) {
      toast.error("Error al actualizar el producto");
      console.log(error);
    }
    setProductLoading(false);
  };

  // Eliminar un producto
  const handleDeleteProduct = async (id) => {
    setProductLoading(true);
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Producto eliminado exitosamente");
    } catch (error) {
      toast.error("Error al eliminar el producto");
      console.log(error);
    }
    setProductLoading(false);
  };

  /********** Obtener el carrito del usuario **********/
  const getUserCart = async () => {
    setProductLoading(true); 
    try {
      const cartCollectionRef = collection(db, `usersCarts/${currentUser.uid}/myCart`);

      onSnapshot(cartCollectionRef, (querySnapshot) => {
        const cart = [];
        querySnapshot.forEach((doc) => {
          cart.push({ id: doc.id, ...doc.data() });
        });
        setUserCart(cart); 
      });
    } catch (error) {
      toast.error("Error al obtener el carrito del usuario");
      console.error("Error al obtener el carrito del usuario:", error);
    }
    setProductLoading(false); 
  };

  /********** Agregar al Carrito **********/
  const handleAdd = async (product) => {
    setAddRemoveCartLoading(true); 

    try {
      if (!currentUser) {
        setAddRemoveCartLoading(false);
        toast.error("¡Por favor, inicie sesión!");
        return;
      }

      const cartDocRef = doc(db, `usersCarts/${currentUser.uid}/myCart`, product.id);
      const cartDocSnapshot = await getDoc(cartDocRef);

      if (cartDocSnapshot.exists()) {
        await setDoc(cartDocRef, {
          quantity: increment(1), 
        }, { merge: true });
        toast.success("Producto incrementado en 1");
      } else {
        await setDoc(cartDocRef, {
          quantity: 1,
          ...product, 
        });
        toast.success("Producto agregado al carrito");
      }
    } catch (error) {
      toast.error("Error al agregar el producto al carrito");
    }
    setAddRemoveCartLoading(false); 
  };

  /********** Manejar la eliminación del carrito **********/
  const handleRemove = async (productId) => {
    setAddRemoveCartLoading(true); 
    try {
      if (!currentUser) {
        setAddRemoveCartLoading(false);
        return;
      }

      const cartDocRef = doc(db, `usersCarts/${currentUser.uid}/myCart`, productId);
      const cartDocsSnapshot = await getDoc(cartDocRef);

      if (cartDocsSnapshot.exists()) {
        const currentQuantity = cartDocsSnapshot.data().quantity;

        if (currentQuantity > 1) {
          await setDoc(cartDocRef, { quantity: increment(-1) }, { merge: true });
          toast.success("Producto disminuido en 1");
        } else {
          await deleteDoc(cartDocRef);
          toast.success("Producto eliminado del carrito");
        }
      }
    } catch (error) {
      toast.error("Error al eliminar el producto del carrito");
    }
    setAddRemoveCartLoading(false); 
  };

  const TotalCart = (userCart) => {
    return userCart.reduce(
      (total, product) => total + product.price * product.quantity, 
      0
    );
  };

  /********** Realizar un pedido **********/
  const placeOrder = async () => {
    setProductLoading(true);
    try {
      // Generar la fecha del pedido
      const orderDate = new Date().toLocaleDateString();
      const newOrder = { userCart, orderDate };
  
      // Referencia a la colección de pedidos
      const ordersCollectionRef = collection(db, `userOrders/${currentUser.uid}/orders`);
  
      // Agregar el nuevo pedido
      await addDoc(ordersCollectionRef, newOrder);
      toast.success("Pedido agregado exitosamente!");
  
      // Referencia a la colección del carrito
      const cartCollectionRef = collection(db, `usersCarts/${currentUser.uid}/myCart`);
      const cartQuerySnapshot = await getDocs(cartCollectionRef);
  
      // Crear batch para eliminar productos del carrito
      const batch = writeBatch(db);
  
      // Eliminar cada producto del carrito
      cartQuerySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      // Ejecutar el batch
      await batch.commit();
      toast.success("Carrito vaciado correctamente!");
  
      // Vaciar el estado local del carrito
      setUserCart([]);
    } catch (error) {
      console.error("Error al realizar el pedido:", error); // Log del error completo
      toast.error("Error al realizar el pedido: " + error.message); // Mostrar el mensaje de error específico
    }
    setProductLoading(false);
  };

  /********** Obtener historial de pedidos del usuario **********/
  const getUserOrderHistory = async () => {
    setProductLoading(true); 
    try {
      const ordersCollectionRef = collection(db, `userOrders/${currentUser.uid}/orders`);

      const q = query(ordersCollectionRef, orderBy("orderDate", "desc")); 
      onSnapshot(q, (querySnapshot) => {
        const orderHistory = [];

        querySnapshot.forEach((doc) => {
          orderHistory.push({ id: doc.id, ...doc.data() });
        });
        setUserOrder(orderHistory); 
      });
    } catch (error) {
      console.log("Error en el historial de pedidos:", error);
    }
    setProductLoading(false); 
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
        handleUpdateProduct,
        handleDeleteProduct,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

// 3er Paso -> Hook Personalizado
const useProduct = () => useContext(ProductContext);

export { ProductProvider, useProduct };
