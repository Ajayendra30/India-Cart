import axios from "axios";
import React, { useEffect, useState } from "react";

const Order = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // 🔄 FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/orders`);
        setOrders(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-info";
      case "SHIPPED":
        return "bg-primary";
      case "DELIVERED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const calculateOrderTotal = (items = []) => {
    return items.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center mb-4">Order Management</h2>

      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Orders ({orders.length})</h5>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <React.Fragment key={order.orderId}>
                      <tr>
                        <td className="fw-bold">{order.orderId}</td>

                        <td>
                          {order.customerName}
                          <div className="small text-muted">{order.email}</div>
                        </td>

                        <td>
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td>
                          <span className={`badge ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>

                        <td>{order.items?.length || 0}</td>

                        <td className="fw-bold">
                          {formatCurrency(calculateOrderTotal(order.items))}
                        </td>

                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => toggleOrderDetails(order.orderId)}
                          >
                            {expandedOrder === order.orderId
                              ? "Hide Details"
                              : "View Details"}
                          </button>
                        </td>
                      </tr>

                      {/* 🔽 EXPANDED ORDER ITEMS */}
                      {expandedOrder === order.orderId && (
                        <tr>
                          <td colSpan="7">
                            <div className="p-3 bg-light">
                              <h6>Order Items</h6>

                              <table className="table table-sm table-bordered">
                                <thead className="table-secondary">
                                  <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {order.items?.map((item, i) => (
                                    <tr key={i}>
                                      <td>{item.productName}</td>
                                      <td className="text-center">{item.quantity}</td>
                                      <td className="text-end">
                                        {formatCurrency(item.totalPrice)}
                                      </td>
                                    </tr>
                                  ))}

                                  <tr className="table-info">
                                    <td colSpan="2" className="text-end fw-bold">
                                      Total
                                    </td>
                                    <td className="text-end fw-bold">
                                      {formatCurrency(
                                        calculateOrderTotal(order.items)
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;