import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();

  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  // 🔄 FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/product/${id}`);
        setProduct(res.data);
        setUpdateProduct(res.data);

        // 🔥 fetch image as blob
        const imgRes = await axios.get(
          `${baseUrl}/api/product/${id}/image`,
          { responseType: "blob" }
        );

        const file = new File([imgRes.data], res.data.imageName || "image.jpg", {
          type: imgRes.data.type,
        });

        setImage(file);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔁 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  // 🖼 IMAGE CHANGE
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // 🚀 SUBMIT UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("imageFile", image);
      formData.append(
        "product",
        new Blob([JSON.stringify(updateProduct)], {
          type: "application/json",
        })
      );

      await axios.put(`${baseUrl}/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Product updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Failed to update product");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Update Product</h2>

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={updateProduct.name}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label>Brand</label>
          <input
            type="text"
            className="form-control"
            name="brand"
            value={updateProduct.brand}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={updateProduct.description}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={updateProduct.price}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label>Category</label>
          <select
            className="form-select"
            name="category"
            value={updateProduct.category}
            onChange={handleChange}
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

        <div className="col-md-4">
          <label>Stock</label>
          <input
            type="number"
            className="form-control"
            name="stockQuantity"
            value={updateProduct.stockQuantity}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label>Release Date</label>
          <input
            type="date"
            className="form-control"
            name="releaseDate"
            value={updateProduct.releaseDate}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label>Image</label>
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              style={{
                width: "100%",
                height: "150px",
                objectFit: "contain",
                marginBottom: "10px",
              }}
            />
          )}

          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>

        <div className="col-12">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={updateProduct.productAvailable}
              onChange={(e) =>
                setUpdateProduct({
                  ...updateProduct,
                  productAvailable: e.target.checked,
                })
              }
            />
            <label className="form-check-label">
              Product Available
            </label>
          </div>
        </div>

        <div className="col-12">
          <button className="btn btn-primary">Update Product</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;