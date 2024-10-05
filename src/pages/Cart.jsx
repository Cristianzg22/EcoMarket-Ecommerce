import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// Componente para mostrar un spinner de carga
import MySpinner from '../components/MySpinner';

// CSS: Importamos componentes de React Bootstrap
import { Button, Container, Figure } from "react-bootstrap";

// API de Contexto: Importamos el contexto de productos
import { useProduct } from "../context/ProductContext";

const Cart = () => {

  // Extraemos funciones y variables del contexto de productos
  const { 
    handleAdd, // Función para agregar un producto al carrito
    handleRemove, // Función para remover un producto del carrito
    userCart, // Estado del carrito del usuario
    productLoading, // Indicador de carga mientras se obtienen productos
    getUserCart, // Función para obtener el carrito del usuario
    TotalCart, // Función para calcular el total del carrito
    addRemovecartLoading, // Indicador de carga mientras se agregan/remueven productos
    placeOrder, // Función para realizar el pedido
  } = useProduct();

  // useEffect para cargar el carrito del usuario cuando el componente se monta
  useEffect(() => {
    getUserCart();
  }, []);
  
  return (
    <Container style={{ marginTop: "80px" }}>
      
      {/* Mostrar spinner mientras se cargan los productos */}
      {productLoading ?
        <MySpinner /> 
        :
        (
          <>
            {/* Título del carrito */}
            <h3 className="text-center mb-4">Carrito de Compras</h3>

            {/* Si el carrito está vacío, mostrar un mensaje */}
            { userCart.length === 0 ? (
              <p className="text-center"> ¡UPS! Tu carrito está vacío 🛒</p>
            ) 
            : 
            (
              <div className="row justify-content-center mb-5">
                <div className="col-12">
                  <div>
                    {/* Mapeamos el carrito del usuario y mostramos cada producto */}
                    {userCart.map((p) => (
                      <div key={p.id} className="border mb-3 p-3">

                        <div className="d-flex justify-content-between">
                          <div className="p-2 d-flex">
                            <Figure className="me-5">
                              {/* Imagen del producto */}
                              <Figure.Image width={80} src={p.imageURL} />
                            </Figure>

                            <div>
                              {/* Nombre y precio del producto */}
                              <p className="mb-2 text-muted"></p>
                              <p> {p.name}</p>
                              <p>Precio: ${p.price} COP</p>
                            </div>
                          </div>

                          <div className="p-2 d-flex align-items-center">
                            {/* Botones para incrementar o reducir la cantidad del producto */}
                            <Button 
                              disabled={addRemovecartLoading} 
                              onClick={() => handleRemove(p.id)} 
                              variant="dark" 
                            > 
                              - 
                            </Button>
                            <span className='m-4'>   {p.quantity} </span>
                            <Button 
                              disabled={addRemovecartLoading} 
                              onClick={() => handleAdd({ ...p })} 
                              variant="dark"
                            > 
                              + 
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-lg-4 mt-4">
                  {/* Resumen del pedido */}
                  <h5 className="text-center">Resumen del Pedido</h5>

                  <div className="d-flex justify-content-between mt-4 mb-4 p-3 mb-2 bg-body-secondary rounded">
                    <div>Precio Total</div>
                    {/* Mostrar el precio total del carrito */}
                    <div> $ {Math.round(TotalCart(userCart))}COP </div>
                  </div>

                  <div className="d-grid mt-3">
                    {/* Botón para proceder con la compra */}
                    <Button variant="warning" as={NavLink} to="/order" onClick={() => { placeOrder() }}>Comprar</Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      }

    </Container>
  );
}

export default Cart;
