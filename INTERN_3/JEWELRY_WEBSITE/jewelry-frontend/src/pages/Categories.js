import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Shop by Category</h2>
      <div className="row">
        {categories.map(cat => (
          <div key={cat._id} className="col-md-3 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{cat.name}</h5>
                <p>{cat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
