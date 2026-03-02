import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";

const Home = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const { addToCart } = useContext(AppContext);

  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      }
    };

    fetchData();
  }, []);

  // 🔥 FILTER BY CATEGORY
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Something went wrong...
      </h2>
    );
  }

  return (
    <div
      className="grid"
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {filteredProducts.map((product) => {
        const id = product.id || product._id;

        return (
          <div
            key={id}
            className="card mb-3"
            onClick={() => navigate(`/product/${id}`)}
            style={{
              width: "270px",
              borderRadius: "10px",
              overflow: "hidden",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={`${baseUrl}/api/product/${id}/image`}
              alt={product.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "contain",
                background: "#f2f2f2",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />

            <div className="card-body">
              <h5 className="card-title">
                {product.name.toUpperCase()}
              </h5>

              <i style={{ fontSize: "0.8rem" }}>
                by {product.brand}
              </i>

              <hr />

              <h5> ₹ {product.price}</h5>

              <button
                className="btn-hover color-9"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);   // 🔥 NOW WORKING
                }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;