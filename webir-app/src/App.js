import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";

function App() {
  const extractMLU = (link) => {
    let regexToMatchMLU = /MLU-\d+/;
    var arr = regexToMatchMLU.exec(link);
    if (arr) {
      let mluNumber = arr[0].slice(4, arr[0].length);
      setMlu(mluNumber);
      console.log(mluNumber);
    }
  };
  const [mlu, setMlu] = useState("");
  const [link, setLink] = useState("");
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
        <p>Ingrese sku o link del producto a notificar:</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1vh",
            height: "3vh",
            width: "25vw",
          }}
        >
          <input
            style={{ height: "90%" }}
            type="text"
            value={mlu}
            onChange={(e) => setMlu(e.target.value)}
            placeholder={"MLU"}
          />
          <br />
          <input
            style={{ height: "90%" }}
            type="text"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              extractMLU(e.target.value);
            }}
            placeholder={"Link"}
          />
          <button style={{ height: "100%" }} onClick={() => fetchProduct(mlu)}>
            Buscar
          </button>
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
