import React, { useState } from 'react';

// CSS
import { Col, Button, Row, Container, Form } from "react-bootstrap";

// Contexto API
import { useProduct } from '../../context/ProductContext';

const AddProduct = () => {
  // Se extrae la función para manejar la creación de un nuevo producto desde el contexto de productos
  const { handleCreateNewListing } = useProduct();

  // Estados locales para almacenar los valores de entrada del formulario
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Men's Clothing");
  const [price, setPrice] = useState(0);
  const [imageURL, setImageURL] = useState("");

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();  // Previene el comportamiento predeterminado del formulario

    // Llama a la función para crear un nuevo listado de producto
    handleCreateNewListing(name, category, price, imageURL);

    // Limpia los campos del formulario después de agregar el producto
    setName("");
    setPrice(0);
    setImageURL("");
  };

  return (
    <>
      <Container style={{ marginTop: "80px" }}>
        <h3 className="text-center mb-4">Agregar Producto</h3>

        {/* Fila y columna para centrar el formulario en la página */}
        <Row className="d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Form onSubmit={handleSubmit}>
              {/* Campo para el nombre del producto */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nombre del Producto</Form.Label>
                <Form.Control 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text" 
                  placeholder="Ingresa el Nombre del Producto"
                  required
                />
              </Form.Group>

              {/* Campo para seleccionar la categoría del producto */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Categoría</Form.Label>
                <Form.Select 
                  aria-label="Seleccione una categoría"
                  defaultValue={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Men's Clothing">Ropa de Hombre</option>
                  <option value="Women's Clothing">Ropa de Mujer</option>
                  <option value="Jewelery">Joyería</option>
                  <option value="Electronics">Electrónicos</option>
                </Form.Select>  
              </Form.Group>

              {/* Campo para ingresar el precio del producto */}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number" 
                  placeholder="Ingresa el Precio" 
                  required
                />
              </Form.Group>

              {/* Campo para ingresar el enlace de la imagen del producto */}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Enlace de la Imagen del Producto</Form.Label>
                <Form.Control
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  type="text"
                  required
                />
              </Form.Group>

              {/* Botón para enviar el formulario y agregar el producto */}
              <Button variant="primary" type="submit">
                Agregar Producto
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AddProduct;
