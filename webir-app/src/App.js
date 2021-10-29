import "./App.css";
import React, { Component} from "react";

class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
        <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    );
  }
}

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:'',
      precio:'',
      title:null,
      thumbnail:null,
      permalink:null,
      price:null,
      free_shipping:null,
      id:null,
      showPopup:false,
      requestResult:null
    };
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  sendSuscription(email, sku, dropPrice) {
    // Simple GET request using fetch
    const requestOptions = {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, sku: sku, drop_price: parseInt(dropPrice), drop_discount: 0 })
    };
    fetch('http://localhost:5000/product', requestOptions)
      .then(async response => {
          const isJson = response.headers.get('content-type')?.includes('application/json');
          const data = isJson && await response.json();

          // check for error response
          if (response.ok) {
            this.setState({ requestResult: "Operacion exitosa", showPopup:true })
          } else {
              // get error message from body or default to response status
              this.setState({ requestResult: "Error de operación" , showPopup:true })
              const error = (data && data.message) || response.status;
              return Promise.reject(error);
          }
          
      })
      .catch(error => {
          this.setState({ requestResult: "Error de operación" , showPopup:true })
          console.error('There was an error!', error);
      });
  }

  render() {
    const { email } = this.state;
    const { precio } = this.state;
    return (
      <li>
        <div className="row p-2 bg-white border rounded spaceItem">
          <div className="col-md-3 mt-1"><img className="img-fluid img-responsive rounded product-image" src={this.props.thumbnail}></img></div>
          <div className="col-md-6 mt-1">
            <h5>{this.props.title}</h5>
            <div className="d-flex flex-row">
              
            </div>
            <div className="mt-1 mb-1 spec-1"><span>Alguna propiedad?</span><span className="dot"></span><span>Otra propiedad?</span></div>
            <div className="mt-1 mb-1 spec-1"><span>Departamento?</span></div>
            <p className="text-justify text-truncate para mb-0">Alguna descripcion del producto? Publicidad paga?<br></br></p>
            <button onClick={(ev) => {ev.preventDefault();window.window.open(this.props.permalink)}} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm mt-2 App-link vinculoML" type="button">Ver publicación en ML</button>
          </div>
          <div className="align-items-center align-content-center col-md-3 border-left mt-1">
            <div className="d-flex flex-row align-items-center">
              <h4 className="mr-1">${this.props.price}</h4><span className="strike-text">${this.props.price}</span>
            </div>
            <h6 className="text-success">{(this.props.free_shipping != null && this.props.free_shipping) ? "Envio gratuito" : <span className="strike-text">Envio gratuito</span>}</h6>
            <div className="d-flex flex-column mt-4">
              <div>
                <input onChange={(e) => this.setState({ email: e.target.value })} value={email} className="search" type="search" placeholder="Email"></input>
              </div>

              <div>
                <input onChange={(e) => this.setState({ precio: e.target.value })} value={precio} className="search" type="search" placeholder="Precio"></input>
              </div>

              <button onClick={() => this.sendSuscription(email, this.props.id, precio)} className="btn btn-primary btn-sm" type="button">Suscribirse al producto</button>
            </div>
          </div>

        </div>
        
      </li>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalReactPackages: null,
      busqueda2:'',
      selectedOption:'normal'
    };
    this.onValueChange = this.onValueChange.bind(this);
  }

  searchProducts(busqueda2) {
    // Simple GET request using fetch
    fetch('https://api.mercadolibre.com/sites/MLU/search?q='+busqueda2)
      .then(response => response.json())
      .then(data => this.setState({ totalReactPackages: data }));
  }

  searchProduct(busqueda, tipo) {
    if (tipo == "normal") {
      fetch('https://api.mercadolibre.com/sites/MLU/search?q='+busqueda)
        .then(response => response.json())
        .then(data => this.setState({ totalReactPackages: data }));
    } else {
      let regexToMatchMLU = /MLU-\d+/;
      var arr = regexToMatchMLU.exec(busqueda);
      if (arr) {
        let mluNumber = arr[0].slice(4, arr[0].length);
        fetch('https://api.mercadolibre.com/items/MLU'+mluNumber)
          .then(response => response.json())
          .then(data => this.setState({ totalReactPackages: {results:[data]} }));
      } else {
        this.setState({ totalReactPackages: null })
      }
      
    }
  }

  onValueChange(event) {
    this.setState({
      selectedOption: event.target.value
    });
  }

  render() {
    const { totalReactPackages } = this.state;
    const { busqueda2 } = this.state;
    return (
      <body>
      <div className='app'>

        <div className="topnav">
          <a className="active" href="http://localhost:3000">DEMO</a>
          <div className="search-container">

              <div id="searchInContainer">
                  <input type="radio" name="check" value="normal" id="searchSite" 
                    checked={this.state.selectedOption === "normal"} 
                    onChange={this.onValueChange}/>
                  <label htmlFor="searchSite" id="siteNameLabel">Buscar por producto</label>
                            
                  <input type="radio" name="check" value="email" id="searchWeb"
                    checked={this.state.selectedOption === "email"} 
                    onChange={this.onValueChange}/>
                  <label htmlFor="searchWeb">Buscar por link</label>
              </div> 
              <input type="text" placeholder="Buscar.." name="search" className="searchBar" onChange={(e) => this.setState({ busqueda2: e.target.value })} value={busqueda2}></input>
              <button type="submit" onClick={() => this.searchProduct(busqueda2, this.state.selectedOption)}><i className="fa fa-search"></i></button>

          </div>
        </div>

      <div >
      



  



      <div className="card text-center m-3">
        <div className="card-body">
          Mi busqueda fue: {totalReactPackages != null ? totalReactPackages.query : totalReactPackages}
        </div>

        <div className="container mt-5 mb-5">
          <div className="d-flex justify-content-center row">
              <div className="col-md-10" id="col-md-10">
                <ul>
                  {totalReactPackages!=null ?
                    totalReactPackages.results.map((e) => 
                      <Product 
                        title={e.title}
                        thumbnail={e.thumbnail}
                        permalink={e.permalink}
                        price={e.price}
                        free_shipping={e.shipping.free_shipping}
                        id={e.id}
                      />
                    ) :
                    null
                  }
                </ul>
              </div>
          </div>
        </div>
        
      </div>
      
    
      </div>
      </div>    </body>
    );
  }

}

export default App;
