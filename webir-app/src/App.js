import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          CAMEL CAMEL CAMEL para MercadoLibre
        </p>
        <p>
        Ingrese sku del producto a notificar:
        </p>
        <div style={{display: 'flex',alignItems: 'center',gap: '1vh'}}>
        <input type="text" style={{height: '2vh' ,width: '20vw'}}/> <button > Buscar </button>
        <br/>
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
