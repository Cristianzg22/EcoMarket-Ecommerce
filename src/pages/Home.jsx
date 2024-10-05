import React, { useState, useEffect } from 'react';
import MySpinner from '../components/MySpinner';
import ProductCard from '../components/ProductCard';
import { useProduct } from '../context/ProductContext';

const Home = () => {
  const { products, productLoading, minPrice, maxPrice } = useProduct();
  const [searchVal, setSearchVal] = useState("");
  const [priceFilter, setPriceFilter] = useState(maxPrice);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Verificar valores de minPrice y maxPrice
  useEffect(() => {
    if (products.length > 0) {
      setPriceFilter(maxPrice);
    }
  }, [maxPrice, products]);

  const translateCategory = (category) => {
    switch (category) {
      case "Men's Clothing":
        return "Ropa de Hombre";
      case "Women's Clothing":
        return "Ropa de Mujer";
      case "Jewelery":
        return "Joyería";
      case "Electronics":
        return "Electrónicos";
      default:
        return category;
    }
  };

  const handleSetPriceFilter = (e) => {
    setPriceFilter(Number(e.target.value));
  };

  const handleCategoryCheckboxChange = (e) => {
    const category = e.target.value;
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const resetFilters = () => {
    setSearchVal("");
    setPriceFilter(maxPrice);
    setSelectedCategories([]);
  };

  const filteredProductList = products
    .filter((product) => !product.discount) // Excluir productos con descuento
    .filter((item) => {
      if (searchVal.trim() === "") {
        return true;
      }
      return item.name.toLowerCase().includes(searchVal.toLowerCase());
    })
    .filter((product) => {
      return product.price <= priceFilter;
    })
    .filter((product) => {
      if (selectedCategories.length === 0) {
        return true;
      }
      return selectedCategories.includes(product.category);
    })
    .map((product) => ({
      ...product,
      category: translateCategory(product.category),
    }));

  return (
    <div>
      <div className="container mb-5" style={{ marginTop: "80px", backgroundColor: "#f0f0f0" }}>
        {productLoading || products.length === 0 ? (
          <MySpinner />
        ) : (
          <div>
            <h3 className="text-center mb-4 fw-bold text-warning">Todos los Productos</h3>

            <div className="row justify-content-center mb-4">
              <div className="col-lg-5">
                <input
                  className="form-control me-2 border border-dark"
                  type="search"
                  placeholder="Buscar productos..."
                  aria-label="Buscar"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-2 pe-3 mb-4 p-3">
                <h4 className="fw-semibold mb-4 text-black">Filtro</h4>

                <div className="input-group mb-3">
                  <label htmlFor="customRange1" className="form-label fw-semibold text-black">
                    Precio máximo: ${priceFilter}
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id="customRange1"
                    min={minPrice}
                    max={maxPrice}
                    step="10"
                    value={priceFilter}
                    onChange={handleSetPriceFilter}
                    style={{ color: "#000000" }}
                  />
                </div>

                <p className="fw-semibold text-muted">Categorías</p>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="Ropa de Hombre"
                    id="Ropa de Hombre"
                    checked={selectedCategories.includes("Ropa de Hombre")}
                    onChange={handleCategoryCheckboxChange}
                  />
                  <label className="form-check-label" htmlFor="Ropa de Hombre">
                    Ropa de Hombre
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="Ropa de Mujer"
                    id="Ropa de Mujer"
                    checked={selectedCategories.includes("Ropa de Mujer")}
                    onChange={handleCategoryCheckboxChange}
                  />
                  <label className="form-check-label" htmlFor="Ropa de Mujer">
                    Ropa de Mujer
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="Joyería"
                    id="Joyería"
                    checked={selectedCategories.includes("Joyería")}
                    onChange={handleCategoryCheckboxChange}
                  />
                  <label className="form-check-label" htmlFor="Joyería">
                    Joyería
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="Electrónicos"
                    id="Electrónicos"
                    checked={selectedCategories.includes("Electrónicos")}
                    onChange={handleCategoryCheckboxChange}
                  />
                  <label className="form-check-label" htmlFor="Electrónicos">
                    Electrónicos
                  </label>
                </div>

                {/* Botón de Eliminar Filtros */}
                <button className="btn btn-warning mt-3" onClick={resetFilters}>
                  Eliminar Filtros
                </button>
              </div>

              <div className="col-lg-10">
                <div className="row g-3">
                  {filteredProductList?.map((p) => (
                    <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                      <ProductCard key={p.id} id={p.id} {...p} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center text-lg-start bg-light text-muted">
  <div className="container p-4">
    <p>Desarrollado por Albert Peñaranda - Maria Hernandez - Cristian Zambrano</p>
  </div>
</footer>
    </div>
  );
};

export default Home;
