import React, { useState } from 'react'

// Componente: Importamos un spinner y la tarjeta de producto personalizada
import MySpinner from '../components/MySpinner';
import ProductCard from '../components/ProductCard';

// API de Contexto: Importamos el contexto de productos
import { useProduct } from '../context/ProductContext';

const Home = () => {
  // Extraemos productos, el estado de carga y los precios mínimo y máximo del contexto
  const { products, productLoading, minPrice, maxPrice } = useProduct();
  
  // Estados para búsqueda, filtro de precio y categorías seleccionadas
  const [searchVal, setSearchVal] = useState(""); // Valor de búsqueda
  const [priceFilter, setPriceFilter] = useState(10000); // Filtro de precio inicial
  
  // Filtro por categorías
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Función para establecer el valor del filtro de precio
  const handleSetPriceFilter = (e) => {
    setPriceFilter(Number(e.target.value)); // Convertimos el valor a número
  }

  // Función que maneja la selección de categorías mediante checkbox
  const handleCategoryCheckboxChange = (e) => {
    const category = e.target.value;
    if (e.target.checked) {
      // Añadir categoría al array de categorías seleccionadas
      setSelectedCategories([...selectedCategories, category]);
    } else {
      // Eliminar categoría del array de categorías seleccionadas
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  // Filtro de productos en función de búsqueda, precio y categorías
  const filteredProductList = products
    // Filtrar por nombre si la búsqueda está vacía o si coincide con el nombre del producto
    .filter((item) => {
      if (searchVal.trim() === "") {
        return true;
      }
      if (item.name.toLowerCase().includes(searchVal.toLowerCase())) {
        return item;
      }
    })
    // Filtrar por precio
    .filter((product) => {
      return product.price <= priceFilter;
    })
    // Filtrar por categorías seleccionadas
    .filter((product) => {
      if (selectedCategories.length == 0) {
        return true;  // Si no hay categorías seleccionadas, mostrar todos los productos
      }
      return selectedCategories.includes(product.category);
    })


  return (
    <>
      { productLoading || products.length === 0 ? 
      
      // Mostrar spinner de carga mientras se obtienen los productos
       ( <MySpinner />
      
      ) : (
      
      // Contenido principal cuando se cargan los productos
      <div className="container mb-5" style={{ marginTop: "80px"}}>
               
        <h3 className="text-center mb-4">Todos los Productos</h3>

        {/* Filtro de búsqueda */}
        <div className="row justify-content-center">
          <div className="col-lg-5 mb-5">
            <input
              className="form-control me-2" 
              type="search" 
              placeholder="Buscar" 
              aria-label="Buscar"
              onChange={e => setSearchVal(e.target.value)} 
              />

          </div>
        </div>
        
        <div className="row">
        
          {/* Sección de filtros */}
          <div className="col-lg-2 pe-3 mb-4">
            <h4 className="fw-semibold mb-4 "> Filtro </h4>

            {/* Filtro de precio */}
            <div className="input-group mb-3">
              <label htmlFor ="customRange1" className="form-label fw-semibold text-muted">Precio : ₹{priceFilter}</label>
              <input
                type="range"
                className="form-range"
                id="customRange1"
                min={minPrice}
                max={maxPrice}
                step="10"
                value={priceFilter}
                onChange={handleSetPriceFilter}
              />
            </div>

            {/* Filtro de categorías */}
            <p className="fw-semibold text-muted"> Categoría </p>

            {/* Checkbox para filtrar por ropa de hombre */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Men's Clothing" 
                id="Men"
                onChange={handleCategoryCheckboxChange} 
              />
              <label className="form-check-label" htmlFor ="Men">
                Ropa de Hombre
              </label>
            </div>

            {/* Checkbox para filtrar por ropa de mujer */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Women's Clothing" 
                id="Women"
                onChange={handleCategoryCheckboxChange} 
              />
              <label className="form-check-label" htmlFor ="Women">
                Ropa de Mujer
              </label>
            </div>

            {/* Checkbox para filtrar por joyería */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Jewelery" 
                id="Jewelery"
                onChange={handleCategoryCheckboxChange} 
              />
              <label className="form-check-label" htmlFor ="Jewelery">
                Joyería
              </label>
            </div>

            {/* Checkbox para filtrar por electrónica */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Electronics" 
                id="Electronics"
                onChange={handleCategoryCheckboxChange} 
              />
              <label className="form-check-label" htmlFor ="Electronics">
                Electrónica
              </label>
            </div>

          </div>

          {/* Sección de productos filtrados */}
          <div className="col-lg-10">
              <div className="row g-3">
                {/* Renderizar productos filtrados */}
                {filteredProductList?.map((p) => (
                  <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                    <ProductCard key={p.id} id={p.id} {...p} />
                  </div>
                ))}
            </div>
          </div>
        </div>
        
      </div>

        )
    }
    </>
    )
}

export default Home;
