import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const ExampleComponent = () => {
  const [promoValues, setPromoValues] = useState([]);

  function getGeofences() {
    const newPromoValues = [];
    const currentTime = new Date().getTime();
    
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("promo-")) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          const promo = JSON.parse(value);
          const storedTime = new Date(promo.horaAtual).getTime();
          const timeDifference = currentTime - storedTime;
          const timeThreshold = 40 * 60 * 1000; // 3 minutes in milliseconds

          if (timeDifference <= timeThreshold) {
            newPromoValues.push(promo);
          } else {
            localStorage.removeItem(key);
          }
        }
      }
    });

    setPromoValues(newPromoValues);
  }

  useEffect(() => {
    setInterval(getGeofences, 1000)
  }, [promoValues]);

  return (
    <div className="row g-0" style={{ backgroundColor: "#d3d3d3", display: "flex" }}>
        {promoValues.map((promo, index) => (
          <div key={index} className="card col-lg-6">
            <div className="card-header">{promo.titulo}</div>
            <div className="card-body">
              <p className="card-text">{promo.descLonga}</p>
            </div>
            <div className="card-footer text-muted" style={{fontSize: "10px"}}>{promo.horaAtual}</div>
          </div>
        ))}
    </div>
  );
};

export default ExampleComponent;