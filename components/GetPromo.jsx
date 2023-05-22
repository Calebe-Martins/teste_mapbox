// import React, { useEffect, useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ExampleComponent = () => {
//   const [promoValues, setPromoValues] = useState([]);

//   function getGeofences() {
//     const newPromoValues = [];
//     const currentTime = new Date().getTime();
    
//     Object.keys(localStorage).forEach((key) => {
//       if (key.startsWith("promo-")) {
//         const value = localStorage.getItem(key);
//         if (value !== null) {
//           const promo = JSON.parse(value);
//           const storedTime = new Date(promo.horaAtual).getTime();
//           const timeDifference = currentTime - storedTime;
//           const timeThreshold = 40 * 60 * 1000; // 3 minutes in milliseconds

//           if (timeDifference <= timeThreshold) {
//             newPromoValues.push(promo);
//           } else {
//             localStorage.removeItem(key);
//           }
//         }
//       }
//     });

//     setPromoValues(newPromoValues);
//   }

//   useEffect(() => {
//     setInterval(getGeofences, 1000)
//   }, [promoValues]);

//   return (
//     <div className="row g-0" style={{ backgroundColor: "#d3d3d3", display: "flex" }}>
//         {promoValues.map((promo, index) => (
//           <div key={index} className="card col-lg-6">
//             <div className="card-header">{promo.titulo}</div>
//             <div className="card-body">
//               <p className="card-text">{promo.descLonga}</p>
//             </div>
//             <div className="card-footer text-muted" style={{fontSize: "10px"}}>{promo.horaAtual}</div>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default ExampleComponent;
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const ExampleComponent = () => {
  // Define o estado promoValues como um array vazio usando o useState
  const [promoValues, setPromoValues] = useState([]);

  // Função para obter os valores promocionais do localStorage
  function getGeofences() {
    // Cria um novo array para armazenar os novos valores promocionais
    const newPromoValues = [];

    // Obtém o tempo atual em milissegundos
    const currentTime = new Date().getTime();
    
    // Itera sobre as chaves do localStorage
    Object.keys(localStorage).forEach((key) => {
      // Verifica se a chave começa com "promo-"
      if (key.startsWith("promo-")) {
        // Obtém o valor do localStorage com base na chave
        const value = localStorage.getItem(key);
        if (value !== null) {
          // Converte o valor em JSON para objeto
          const promo = JSON.parse(value);
          
          // Obtém o tempo armazenado em milissegundos
          const storedTime = new Date(promo.horaAtual).getTime();
          
          // Calcula a diferença de tempo entre o tempo atual e o tempo armazenado
          const timeDifference = currentTime - storedTime;
          
          // Define o limite de tempo em 3 minutos (40 * 60 * 1000 milissegundos)
          const timeThreshold = 40 * 60 * 1000;

          // Verifica se a diferença de tempo está dentro do limite
          if (timeDifference <= timeThreshold) {
            // Adiciona o objeto promo ao novo array de valores promocionais
            newPromoValues.push(promo);
          } else {
            // Remove o item do localStorage se estiver fora do limite de tempo
            localStorage.removeItem(key);
          }
        }
      }
    });

    // Atualiza o estado promoValues com o novo array de valores promocionais
    setPromoValues(newPromoValues);
  }

  // Executa a função getGeofences a cada 1 segundo usando o useEffect
  useEffect(() => {
    setInterval(getGeofences, 1000)
  }, [promoValues]);

  return (
    <div className="row g-0" style={{ backgroundColor: "#d3d3d3", display: "flex" }}>
      {/* Mapeia os valores promocionais e renderiza um card para cada um */}
      {promoValues.map((promo, index) => (
        <div key={index} className="card col-lg-6">
          <div className="card-header"><h6>{promo.titulo}</h6></div>
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
