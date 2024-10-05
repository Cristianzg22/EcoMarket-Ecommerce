import React from 'react';

// CSS
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

// Context API
import { useProduct } from '../context/ProductContext';

const ProductCard = (props) => {
  const { id, name, price, originalPrice, discountedPrice, category, imageURL, showDiscount } = props; // Desestructura las propiedades del componente
  const { handleAdd, addRemovecartLoading } = useProduct(); // Extrae funciones y estado del contexto de productos

  // Determina qué precio pasar a handleAdd
  const finalPrice = showDiscount ? discountedPrice : price;

  return (
    <Card className="shadow border" style={{ width: '14rem', height: '30rem' }}>
      <Card.Img variant="top" src={imageURL} style={{ height: '12rem', objectFit: 'cover' }} /> {/* Muestra la imagen del producto */}

      <Card.Body className="m-0">
        <Card.Subtitle className="mb-2 text-muted">{category}</Card.Subtitle> {/* Muestra la categoría del producto */}
        <Card.Title>{name}</Card.Title> {/* Muestra el nombre del producto */}

        {showDiscount ? (
          <Card.Text>
            <span style={{ textDecoration: 'line-through', color: 'gray' }}>
              ${originalPrice}
            </span>{' '}
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              ${discountedPrice}
            </span>
          </Card.Text>
        ) : (
          <Card.Text>Precio: ${price}</Card.Text> 
        )}
      </Card.Body>

      <Card.Body>
        <div className="d-grid">
          <Button
            disabled={addRemovecartLoading}
            onClick={() => handleAdd({ id, name, price: finalPrice, imageURL, category })}
            variant="dark"
          >
            Agregar al carrito {/* Botón para añadir el producto al carrito */}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

