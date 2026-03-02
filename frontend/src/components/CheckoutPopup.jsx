import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice }) => {

  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
  const navigate = useNavigate();

  // 🧾 FORM STATE
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [validated, setValidated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🧾 CONFIRM ORDER
  const handleConfirm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsSubmitting(true);

    const orderItems = cartItems.map((item) => ({
      productId: item.id || item._id,
      quantity: item.quantity,
    }));

    const data = {
      customerName: name,
      email: email,
      address: address,
      mobile: mobile,
      paymentMethod: paymentMethod,
      items: orderItems,
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/orders/place`,
        data
      );

      console.log("Order placed:", response.data);

      setToastVariant("success");
      setToastMessage("Order placed successfully!");
      setShowToast(true);

      // 🧹 clear cart
      localStorage.removeItem("cart");

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.log(error);

      setToastVariant("danger");
      setToastMessage("Failed to place order. Please try again.");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🖼 IMAGE CONVERT
  const convertBase64ToDataURL = (base64String, mimeType = "image/jpeg") => {
    if (!base64String) return "https://via.placeholder.com/80";
    if (base64String.startsWith("data:")) return base64String;
    if (base64String.startsWith("http")) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>

        <Form noValidate validated={validated} onSubmit={handleConfirm}>
          <Modal.Body>

            {/* 🛒 ITEMS */}
            <div className="mb-3">
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex mb-3 border-bottom pb-2">
                  <img
                    src={convertBase64ToDataURL(item.imageData)}
                    alt={item.name}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />

                  <div className="ms-3 flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <small>Qty: {item.quantity}</small>
                    <div className="fw-bold">
                      ₹ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 💰 TOTAL */}
            <h5 className="text-center my-3">
              Total: ₹{totalPrice.toFixed(2)}
            </h5>

            {/* 👤 NAME */}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your name
              </Form.Control.Feedback>
            </Form.Group>

            {/* 📧 EMAIL */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Enter valid email
              </Form.Control.Feedback>
            </Form.Group>

            {/* 📍 ADDRESS */}
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={2}
                placeholder="Enter delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter address
              </Form.Control.Feedback>
            </Form.Group>

            {/* 📱 MOBILE */}
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                required
                type="tel"
                pattern="[0-9]{10}"
                placeholder="Enter 10 digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Enter valid 10 digit number
              </Form.Control.Feedback>
            </Form.Group>

            {/* 💳 PAYMENT */}
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Debit/Credit Card</option>
              </Form.Select>
            </Form.Group>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>

            <Button variant="success" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Order"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* 🔔 TOAST */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">Order Status</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default CheckoutPopup;