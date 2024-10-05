import React, { useState } from 'react';
import { useProduct } from '../../context/ProductContext'; 
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

function AddProduct() {
  const { products, handleCreateNewListing, handleUpdateProduct, handleDeleteProduct } = useProduct();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(''); 
  const [price, setPrice] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [discount, setDiscount] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      name: productName,
      category,
      price: parseFloat(price),
      imageURL,
      discount, // Añadir el estado de descuento al nuevo producto
    };

    if (editingProductId) {
      await handleUpdateProduct(editingProductId, productName, category, newProduct.price, imageURL, discount); // Actualizar producto existente
    } else {
      await handleCreateNewListing(productName, category, price, imageURL, discount); // Agregar nuevo producto
    }

    // Limpiar campos después de agregar o actualizar
    setProductName('');
    setCategory('');
    setPrice('');
    setImageURL('');
    setDiscount(false);
    setEditingProductId(null);
  };

  const handleEdit = (product) => {
    setProductName(product.name);
    setCategory(product.category);
    setPrice(product.price);
    setImageURL(product.imageURL);
    setDiscount(product.discount); // Cargar el estado de descuento del producto a editar
    setEditingProductId(product.id);
  };

  const handleDelete = async (id) => {
    await handleDeleteProduct(id); 
  };

  const handleToggleDiscount = async (id) => {
    const updatedProduct = products.find(product => product.id === id);
    const newDiscountStatus = !updatedProduct.discount;

    await handleUpdateProduct(id, updatedProduct.name, updatedProduct.category, updatedProduct.price, updatedProduct.imageURL, newDiscountStatus); // Actualizar producto con nuevo estado de descuento
    toast.success(`Descuento ${newDiscountStatus ? 'activado' : 'desactivado'} para ${updatedProduct.name}`);
  };

  return (
    <Container>
      <h2 className="text-center">Productos</h2>
      <h2 className="text-center pt-4 mt-4">{editingProductId ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formProductName">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre del producto"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>Categoría</Form.Label>
              <Form.Select 
                aria-label="Seleccione una categoría"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Seleccione una categoría</option>
                <option value="Ropa de Hombre">Ropa de Hombre</option>
                <option value="Ropa de Mujer">Ropa de Mujer</option>
                <option value="Joyería">Joyería</option>
                <option value="Electrónicos">Electrónicos</option>
              </Form.Select>  
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formPrice">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingresa el precio"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formImageURL">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa la URL de la imagen"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                required
              />
            </Form.Group>
            {/* <Form.Check
              type="checkbox"
              label="Activar Descuento"
              checked={discount}
              onChange={() => setDiscount(!discount)}
            /> */}
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          {editingProductId ? 'Actualizar Producto' : 'Agregar Producto'}
        </Button>
      </Form>

      <h2 className="text-center pb-4 mt-4">Lista de Productos</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Acciones</th>
            <th>Descuento</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td><img src={product.imageURL} alt={product.name} width="50" /></td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(product)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(product.id)}>Eliminar</Button>
              </td>
              <td>
                <Button
                  variant={product.discount ? 'success' : 'secondary'}
                  onClick={() => handleToggleDiscount(product.id)}
                >
                  {product.discount ? 'Desactivar Descuento' : 'Activar Descuento'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AddProduct;
