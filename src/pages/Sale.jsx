import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useProduct } from '../context/ProductContext';

const Sale = () => {
  const { products, addToCart } = useProduct();

  // Filtrar productos con descuento y aplicar el descuento del 20%
  const discountedProducts = products
    .filter(product => product.discount)
    .map(product => ({
      ...product,
      discountedPrice: Math.round(product.price * 0.8).toFixed(2)
    }));

  return (
    <Container className="mt-5"> {/* Añadimos margen superior */}
      <h2 className="text-center mt-4 text-black pt-5 pb-4">Productos Destacados de la Semana 20%</h2>
      <Row>
        {discountedProducts.map(product => (
          <Col lg={3} md={4} xs={6} key={product.id} className="mb-4">
            <ProductCard
              id={product.id}
              name={product.name}
              originalPrice={product.price}
              discountedPrice={product.discountedPrice}
              category={product.category}
              imageURL={product.imageURL}
              handleAdd={addToCart}
              showDiscount
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Sale;
