import React, { useContext, useState } from "react";
import AppContext from "../Context/Context";
import { FaTrash } from "react-icons/fa";
import CheckoutPopup from "./CheckoutPopup";

const Cart = () => {
  const { cart, addToCart, removeFromCart, deleteFromCart } =
    useContext(AppContext);

  // 🔥 Checkout popup state
  const [showCheckout, setShowCheckout] = useState(false);

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => setShowCheckout(false);

  // 🧮 Total price calculation
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-5 pt-4">
      <h3 className="mb-4">Shopping Cart</h3>

      <div className="row">
        {/* 🛒 LEFT SIDE */}
        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th style={{ width: "140px" }}>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <tr key={item.id}>
                      {/* 🖼 PRODUCT */}
                      <td className="d-flex align-items-center gap-3">
                        <img
                          src={`http://localhost:4000/api/product/${item.id}/image`}
                          alt={item.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <small className="text-muted">{item.brand}</small>
                        </div>
                      </td>

                      {/* 💰 PRICE */}
                      <td>₹ {item.price}</td>

                      {/* 🔢 QUANTITY */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => removeFromCart(item.id)}
                          >
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => addToCart(item)}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* 💵 TOTAL */}
                      <td>
                        ₹ {(item.price * item.quantity).toFixed(2)}
                      </td>

                      {/* 🗑 DELETE */}
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteFromCart(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      🛒 Your cart is empty
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 💰 RIGHT SIDE SUMMARY */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span>Total Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span>Total Price</span>
              <strong>₹ {totalPrice.toFixed(2)}</strong>
            </div>

            <button
              className="btn btn-primary w-100"
              style={{ padding: "12px", fontSize: "16px" }}
              onClick={handleOpenCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 CHECKOUT POPUP */}
      <CheckoutPopup
        show={showCheckout}
        handleClose={handleCloseCheckout}
        cartItems={cart}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default Cart;