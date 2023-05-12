import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const ExampleComponent = () => {
  const [promoValues, setPromoValues] = useState([]);

  function teste() {
    const newPromoValues = [];
    
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("promo-")) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          newPromoValues.push(JSON.parse(value));
        }
      }
    });

    setPromoValues(newPromoValues);
  }

  useEffect(() => {
    setInterval(teste, 1000)
  }, []);

  return (
    <div className="container row" style={{ backgroundColor: "#d3d3d3", display: "flex" }}>
      {promoValues.map((promo, index) => (
        <div key={index} className="card col-sm-6">
          <div className="card-title">{promo.titulo}</div>
          <div className="card-description">{promo.descLonga}</div>
        </div>
      ))}
    </div>
  );
};

export default ExampleComponent;