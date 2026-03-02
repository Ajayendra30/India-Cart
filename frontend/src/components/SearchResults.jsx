import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppContext from "../Context/Context";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);

  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state && location.state.searchData) {
      setSearchData(location.state.searchData);
      setLoading(false);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Search Results</h2>

      {searchData.length === 0 ? (
        <div className="alert alert-info">
          No products found matching your search.
        </div>
      ) : (
        <>
          <p className="text-muted mb-4">
            {searchData.length} product(s) found
          </p>

          <div className="row g-4">
            {searchData.map((product) => {
              const productId = product._id || product.id;

              return (
                <div key={productId} className="col-md-3">
                  <div className="card h-100 shadow-sm">

                    {/* ✅ IMAGE FROM BACKEND API */}
                    <img
                      src={`${baseUrl}/api/product/${productId}/image`}
                      alt={product.name}
                      className="card-img-top p-3"
                      style={{ height: "200px", objectFit: "contain", cursor: "pointer" }}
                      onClick={() => handleViewProduct(productId)}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/200x200?text=No+Image";
                      }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5>{product.name}</h5>
                      <small className="text-muted">{product.brand}</small>

                      <div className="mb-2">
                        <span className="badge bg-secondary">
                          {product.category}
                        </span>
                      </div>

                      <p className="small">
                        {product.description?.substring(0, 80)}...
                      </p>

                      <h5 className="text-primary mt-auto">
                        ₹{product.price?.toLocaleString("en-IN")}
                      </h5>

                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleViewProduct(productId)}
                        >
                          View
                        </button>

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.productAvailable || product.stockQuantity <= 0}
                        >
                          {product.productAvailable && product.stockQuantity > 0
                            ? "Add"
                            : "Out of Stock"}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;