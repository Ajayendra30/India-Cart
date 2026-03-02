import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import UpdateProduct from "./components/UpdateProduct";
import Order from "./components/Order";
import SearchResults from "./components/SearchResults";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./Context/Context";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // 🔥 NEW: LOAD THEME ON APP START
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light-theme";
    document.body.classList.add(savedTheme);
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        
        {/* 🔔 Toast Notification */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
        />

        {/* 🔝 Navbar */}
        <Navbar onSelectCategory={handleCategorySelect} />

        {/* 📦 Page Container */}
        <div style={{ paddingTop: "80px" }}>
          
          <Routes>

            {/* 🏠 HOME */}
            <Route
              path="/"
              element={<Home selectedCategory={selectedCategory} />}
            />

            {/* ➕ ADD PRODUCT */}
            <Route path="/add_product" element={<AddProduct />} />

            {/* 📄 PRODUCT DETAILS */}
            <Route path="/product/:id" element={<Product />} />

            {/* ✏️ UPDATE PRODUCT */}
            <Route path="/product/update/:id" element={<UpdateProduct />} />

            {/* 🛒 CART */}
            <Route path="/cart" element={<Cart />} />

            {/* 📦 ORDERS */}
            <Route path="/orders" element={<Order />} />

            {/* 🔍 SEARCH RESULTS */}
            <Route path="/search-results" element={<SearchResults />} />

          </Routes>
        </div>

      </BrowserRouter>
    </AppProvider>
  );
}

export default App;