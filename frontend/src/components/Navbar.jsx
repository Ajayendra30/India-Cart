import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";

const Navbar = ({ onSelectCategory }) => {

  const navigate = useNavigate();

  // 🛒 CART CONTEXT
  const { cart } = useContext(AppContext);

  // 🌙 THEME INIT
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // 🌙 APPLY THEME
  useEffect(() => {
    document.body.className = theme; // ✅ FIXED
    document.documentElement.setAttribute("data-theme", theme); // ✅ FIXED
  }, [theme]);

  // 🌙 TOGGLE THEME
  const toggleTheme = () => {
    const newTheme =
      theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // 🔎 SEARCH
  const handleChange = async (value) => {
    setInput(value);

    if (!value || value.trim() === "") {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    try {
      setShowSearchResults(true);

      const response = await axios.get(
        `http://localhost:4000/api/products/search?keyword=${value}`
      );

      setSearchResults(response.data);zzz
      setNoResults(response.data.length === 0);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleProductClick = (id) => {
    setShowSearchResults(false);
    setInput("");
    navigate(`/product/${id}`);
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top shadow-sm px-3">

        <div className="container-fluid">

          {/* LOGO */}
          <span
            className="navbar-brand fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            🛒 IndiaCart
          </span>

          <div className="collapse navbar-collapse">

            {/* LEFT MENU */}
            <ul className="navbar-nav me-auto">

              <li className="nav-item">
                <span className="nav-link" onClick={() => navigate("/")}>
                  Home
                </span>
              </li>

              <li className="nav-item">
                <span className="nav-link" onClick={() => navigate("/add_product")}>
                  Add Product
                </span>
              </li>

              <li className="nav-item">
                <span className="nav-link" onClick={() => navigate("/orders")}>
                  Orders
                </span>
              </li>

              {/* CATEGORY */}
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Categories
                </span>

                <ul className="dropdown-menu">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className="dropdown-item"
                        onClick={() => onSelectCategory(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            {/* RIGHT SIDE */}
            <div className="d-flex align-items-center gap-3 position-relative">

              {/* 🌙 THEME BUTTON */}
              <button
                className="btn btn-outline-secondary"
                onClick={toggleTheme}
              >
                {theme === "dark-theme" ? "🌙" : "☀️"}
              </button>

              {/* 📦 ORDERS ICON */}
              <i
                className="bi bi-bag-check"
                style={{ cursor: "pointer", fontSize: "1.3rem" }}
                onClick={() => navigate("/orders")}
              ></i>

              {/* 🛒 CART ICON */}
              <div
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => navigate("/cart")}
              >
                <i className="bi bi-cart" style={{ fontSize: "1.6rem" }}></i>

                {cart.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-10px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {cart.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                )}
              </div>

              {/* 🔍 SEARCH */}
              <input
                className="form-control"
                style={{ width: "250px" }}
                placeholder="Search products..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() =>
                  setTimeout(() => setShowSearchResults(false), 300)
                }
              />

              {/* SEARCH DROPDOWN */}
              {showSearchResults && (
                <div
                  className="position-absolute shadow"
                  style={{
                    top: "45px",
                    width: "260px",
                    maxHeight: "300px",
                    overflowY: "auto",
                    borderRadius: "6px",
                    zIndex: 999,
                    background: "var(--search_result-bg, white)",
                  }}
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => {
                      const id = p.id || p._id;
                      return (
                        <div
                          key={id}
                          onClick={() => handleProductClick(id)}
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                            cursor: "pointer",
                          }}
                        >
                          {p.name}
                        </div>
                      );
                    })
                  ) : noResults ? (
                    <div style={{ padding: "10px" }}>
                      No product found
                    </div>
                  ) : null}
                </div>
              )}

            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;