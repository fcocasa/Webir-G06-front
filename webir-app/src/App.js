import "./App.css";
import React, { Component } from "react";
import Product from "./Product";
class Popup extends React.Component {
  render() {
    return (
      <div className="popup">
        <div className="popup_inner">
          <h1>{this.props.text}</h1>
          <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalReactPackages: null,
      busqueda2: "",
      selectedOption: "normal",
    };
    this.onValueChange = this.onValueChange.bind(this);
  }

  searchProducts(busqueda2) {
    // Simple GET request using fetch
    fetch("https://api.mercadolibre.com/sites/MLU/search?q=" + busqueda2)
      .then((response) => response.json())
      .then((data) => this.setState({ totalReactPackages: data }));
  }

  searchProduct(busqueda, tipo) {
    if (tipo == "normal") {
      fetch("https://api.mercadolibre.com/sites/MLU/search?q=" + busqueda)
        .then((response) => response.json())
        .then((data) => this.setState({ totalReactPackages: data }));
    } else {
      let regexToMatchMLU = /MLU-\d+/;
      var arr = regexToMatchMLU.exec(busqueda);
      if (arr == null) {
        regexToMatchMLU = /MLU\d+/;
        arr = regexToMatchMLU.exec(busqueda);
      }
      if (arr) {
        let mlu = arr[0].replace("-", "");
        let mluNumber = mlu.slice(3, arr[0].length);
        fetch("https://api.mercadolibre.com/items/MLU" + mluNumber)
          .then((response) => response.json())
          .then((data) =>
            this.setState({ totalReactPackages: { results: [data] } })
          );
      } else {
        this.setState({ totalReactPackages: null });
      }
    }
  }

  onValueChange(event) {
    this.setState({
      selectedOption: event.target.value,
    });
  }

  render() {
    const { totalReactPackages } = this.state;
    console.log(totalReactPackages);
    const { busqueda2 } = this.state;
    return (
      <body>
        <div className="app">
          <div className="topnav">
            <a className="active" href="http://localhost:3000">
              DEMO
            </a>
            <div className="search-container">
              <div id="searchInContainer">
                <input
                  type="radio"
                  name="check"
                  value="normal"
                  id="searchSite"
                  checked={this.state.selectedOption === "normal"}
                  onChange={this.onValueChange}
                />
                <label htmlFor="searchSite" id="siteNameLabel">
                  Buscar por producto
                </label>

                <input
                  type="radio"
                  name="check"
                  value="email"
                  id="searchWeb"
                  checked={this.state.selectedOption === "email"}
                  onChange={this.onValueChange}
                />
                <label htmlFor="searchWeb">Buscar por link</label>
              </div>
              <div id="searchBar">
                <input
                  type="text"
                  placeholder="Buscar.."
                  name="search"
                  className="searchBar"
                  onChange={(e) => this.setState({ busqueda2: e.target.value })}
                  value={busqueda2}
                ></input>
                <button
                  type="submit"
                  onClick={() =>
                    this.searchProduct(busqueda2, this.state.selectedOption)
                  }
                >
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="card text-center m-3">
              <div className="card-body">
                Mi busqueda fue:{" "}
                {totalReactPackages != null
                  ? totalReactPackages.query
                  : totalReactPackages}
              </div>
              <div className="container mt-5 mb-5">
                <div className="d-flex justify-content-center row">
                  <div className="col-md-10" id="col-md-10">
                    <ul>
                      {totalReactPackages != null
                        ? totalReactPackages.results.map((e) => (
                            <Product
                              key={e.id}
                              title={e.title}
                              thumbnail={e.thumbnail}
                              permalink={e.permalink}
                              price={e.price}
                              currency={e.currency_id}
                              free_shipping={e.shipping.free_shipping}
                              id={e.id}
                              original_price={e.original_price}
                              country='Uruguay'
                              state={e.address.state_name}
                              city={e.address.city_name}
                            />
                          ))
                        : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    );
  }
}

export default App;
