import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Our Products</h2>
      <div className="row">
        {products.map(p => (
          <div key={p._id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img src={p.imageUrl} className="card-img-top" alt={p.name} />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description}</p>
                <p className="text-success fw-bold">₹{p.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
