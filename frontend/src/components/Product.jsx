import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Product = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ SAFE DATE FORMATTER
  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";

    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
      const day = String(parsed.getDate()).padStart(2, "0");
      const month = String(parsed.getMonth() + 1).padStart(2, "0");
      const year = parsed.getFullYear();
      if (year < 1900) return "Not Available";
      return `${day}-${month}-${year}`;
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return dateString;
    }

    return "Not Available";
  };

  // 🔄 FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/product/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <h2 style={{ padding: "10rem", textAlign: "center" }}>
        Loading...
      </h2>
    );
  }

  if (!product) {
    return (
      <h2 style={{ padding: "10rem", textAlign: "center" }}>
        Product not found
      </h2>
    );
  }

  const productId = product._id || product.id;

  // 🛠 UPDATE
  const handleUpdate = () => {
    navigate(`/product/update/${productId}`);
  };

  // ❌ DELETE
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${baseUrl}/api/product/${productId}`);
      alert("Product deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "80px",
        padding: "3rem 5rem",
        background: "var(--body_background)",
        minHeight: "100vh",
        color: "var(--para-clr)",
      }}
    >
      {/* LEFT IMAGE */}
      <div
        style={{
          width: "300px",
          height: "300px",
          marginLeft: "80px",
          marginTop: "60px",
          background: "#fff",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={`${baseUrl}/api/product/${productId}/image`}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "14px",
          }}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />
      </div>

      {/* RIGHT DETAILS */}
      <div style={{ maxWidth: "600px", paddingTop: "40px" }}>
        <span
          style={{
            color: "#4da3ff",
            fontSize: "13px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "12px",
          }}
        >
          {product.category}
        </span>

        <h1 style={{ fontSize: "36px", margin: "10px 0" }}>
          {product.name}
        </h1>

        <h3 style={{ color: "#ccc", marginBottom: "18px" }}>
          {product.brand}
        </h3>

        <p style={{ lineHeight: "1.6" }}>
          {product.description}
        </p>

        <hr style={{ margin: "25px 0", opacity: 0.3 }} />

        <h2 style={{ fontSize: "28px" }}>
          ₹ {product.price?.toLocaleString("en-IN")}
        </h2>

        {/* ADD TO CART */}
        <button
          className="btn btn-success"
          style={{ marginTop: "12px" }}
          disabled={!product.productAvailable || product.stockQuantity <= 0}
          onClick={() => addToCart(product)}
        >
          {product.productAvailable && product.stockQuantity > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </button>

        <p style={{ marginTop: "18px" }}>
          <b>Stock Available:</b>{" "}
          <span style={{ color: "lightgreen" }}>
            {product.stockQuantity}
          </span>
        </p>

        <p>
          <b>Product listed on:</b>{" "}
          {formatDate(product.releaseDate)}
        </p>

        {/* UPDATE & DELETE */}
        <div style={{ marginTop: "22px" }}>
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update
          </button>

          <button
            className="btn btn-danger"
            style={{ marginLeft: "10px" }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;