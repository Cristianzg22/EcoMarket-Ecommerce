import React from 'react';

// CSS
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

// Context API
import { useProduct } from '../context/ProductContext';

const ProductCard = (props) => {
  const { id, name, price, category, imageURL } = props; // Desestructura las propiedades del componente

  const { handleAdd, addRemovecartLoading } = useProduct(); // Extrae funciones y estado del contexto de productos

  return (
    <Card>
      <Card.Img variant="top" src={imageURL} /> {/* Muestra la imagen del producto */}

      <Card.Body className="m-0">
        <Card.Subtitle className="mb-2 text-muted">{category}</Card.Subtitle> {/* Muestra la categoría del producto */}
        <Card.Title>{name}</Card.Title> {/* Muestra el nombre del producto */}
        <Card.Text>Price: ₹{price}</Card.Text> {/* Muestra el precio del producto */}
      </Card.Body>

      <Card.Body>
        <div className="d-grid">
          <Button 
            disabled={addRemovecartLoading} 
            onClick={() => handleAdd({ id, name, price, imageURL, category })} 
            variant="primary">
            Add to Cart {/* Botón para añadir el producto al carrito */}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
