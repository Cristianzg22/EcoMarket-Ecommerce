import React, { useEffect } from 'react'

// Componente
import MySpinner from '../components/MySpinner';

// CSS
import Table from 'react-bootstrap/Table';
import { Container } from "react-bootstrap";

// Contexto API
import { useProduct } from '../context/ProductContext';


const Order = () => {
  // Contexto API
  // Se obtienen las órdenes del usuario, la función para obtener el historial de órdenes, el total del carrito, y el indicador de carga
  const { userOrder, getUserOrderHistory, TotalCart, productLoading } = useProduct();

  // Hook useEffect
  // Cuando el componente se monta, se llama a la función para obtener el historial de pedidos del usuario
  useEffect(() => {
    getUserOrderHistory();
  }, []);

  return (
    <Container style={{ marginTop: "80px"}}>

      { productLoading ? 
        // Si los productos están cargando, se muestra el spinner
        <MySpinner />

        :

        <>
          <h3 className="text-center mb-4">Mis Pedidos</h3>
      
          { userOrder.length === 0 ? 
            // Si el usuario no tiene órdenes, se muestra un mensaje invitándolo a hacer su primer pedido
            <p className="text-center"> ¡Haz tu primer pedido! 😁</p>
            
            :
            // Si hay órdenes, se muestran en un mapa con una tabla que detalla cada pedido
            userOrder.map((orders) => (
              <div className="mb-5" key={orders.id}>
                {/* Información de la fecha y el ID del pedido */}
                <p className="text-muted fw-semibold">Pedido realizado en: {orders.orderDate}</p>
                <p className="text-muted fw-semibold">ID del Pedido: {orders.id}</p>

                {/* Tabla de pedidos */}
                <Table striped bordered hover size="sm table align-middle">
                    <thead>
                      <tr>
                        {/* Cabeceras de la tabla */}
                        <th className="text-muted">TÍTULO</th>
                        <th className="text-muted">PRECIO</th>
                        <th className="text-muted">CANTIDAD</th>
                        <th className="text-muted">PRECIO TOTAL</th>
                      </tr>
                    </thead>

                    {/* Cuerpo de la tabla con los productos del carrito del usuario */}
                    <tbody className="table-group-divider">
                      {orders.userCart.map((item) => (
                        <tr key={item.id}>
                          {/* Muestra el nombre del producto, precio unitario, cantidad y precio total por artículo */}
                          <td>{item.name}</td>
                          <td>{item.price}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>

                    {/* Pie de tabla que muestra el total de la orden */}
                    <tfoot>
                      <tr>
                        <th colspanspan={2}></th>
                        <th></th>
                        <th>Total</th>
                        <th>&#x20B9; {TotalCart(orders.userCart)}/-</th>
                      </tr>
                    </tfoot>
                </Table>
              </div> 
            ))
          }
     
        </> 
      }

    </Container>        
  )
}

export default Order;
