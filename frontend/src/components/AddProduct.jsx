import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    axios
      .post("http://localhost:4000/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product added successfully:", response.data);
        alert("Product added successfully");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Error adding product");
      });
  };

  return (
    <div className="container">
      <div className="center-container">
        <form className="pt-5" onSubmit={submitHandler}>

          {/* ROW 1 */}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label"><h6>Name</h6></label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                placeholder="Product Name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label"><h6>Brand</h6></label>
              <input
                type="text"
                className="form-control"
                name="brand"
                value={product.brand}
                onChange={handleInputChange}
                placeholder="Enter your Brand"
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="row g-3 mt-2">
            <div className="col-12">
              <label className="form-label"><h6>Description</h6></label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Add product description"
              />
            </div>
          </div>

          {/* ROW 3 (MAIN FIX ROW) */}
          <div className="row g-3 mt-2 align-items-start">

            <div className="col-md-3">
              <label className="form-label"><h6>Price</h6></label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={product.price}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label"><h6>Category</h6></label>
              <select
                className="form-select"
                name="category"
                value={product.category}
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                <option value="Laptop">Laptop</option>
                <option value="Headphone">Headphone</option>
                <option value="Mobile">Mobile</option>
                <option value="Electronics">Electronics</option>
                <option value="Toys">Toys</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label"><h6>Stock</h6></label>
              <input
                type="number"
                className="form-control"
                name="stockQuantity"
                value={product.stockQuantity}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label"><h6>Release Date</h6></label>
              <input
                type="date"
                className="form-control"
                name="releaseDate"
                value={product.releaseDate}
                onChange={handleInputChange}
              />
            </div>

            {/* IMAGE COLUMN FIX */}
            <div className="col-md-2">
              <label className="form-label"><h6>Image</h6></label>
              <input
                className="form-control"
                type="file"
                onChange={handleImageChange}
              />

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "90px",
                    height: "90px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginTop: "8px",
                    border: "1px solid #ddd"
                  }}
                />
              )}
            </div>

          </div>

          {/* ROW 4 */}
          <div className="row mt-3">
            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={product.productAvailable}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      productAvailable: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label">
                  Product Available
                </label>
              </div>
            </div>
          </div>

          {/* ROW 5 */}
          <div className="row mt-3">
            <div className="col-12">
              <button type="submit" className="btn btn-primary px-4">
                Submit
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;