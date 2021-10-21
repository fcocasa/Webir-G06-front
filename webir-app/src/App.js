import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";

function App() {
  const [sku, setSku] = useState("");
  const fetchProduct = (mlu) => {
    fetch("https://api.mercadolibre.com/items/MLU" + mlu)
      .then((res) => {
        res
          .json()
          .then((json) => console.log(json))
          .catch((error) =>
            console.error("Error parsing json from meli:", error)
          );
      })
      .catch((error) => console.error("Error fetching from meli:", error));
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>CAMEL CAMEL CAMEL para MercadoLibre</p>
        <p>Ingrese sku del producto a notificar:</p>
        <div style={{ display: "flex", alignItems: "center", gap: "1vh" }}>
          <input
            type="text"
            style={{ height: "2vh", width: "20vw" }}
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <button onClick={() => fetchProduct(sku)}> Buscar </button>
          <br />
        </div>
        <a
          className="App-link"
          href="https://www.mercadolibre.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buscar en Meli
        </a>
      </header>
    </div>
  );
}

export default App;
