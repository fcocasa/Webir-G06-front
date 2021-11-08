import React, { Component } from "react";
export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: "",
      email: "",
      precio: "",
      title: null,
      thumbnail: null,
      permalink: null,
      price: null,
      free_shipping: null,
      id: null,
      showPopup: false,
      requestResult: null,
    };
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }

  sendSuscription(email, sku, dropPrice) {
    this.setState({ email: "", precio: "" });
    let regexToMatchMLU = /\d+/;
    var skuNumber = regexToMatchMLU.exec(sku);
    var req = {
      email: email,
      sku: skuNumber[0],
      drop_price: parseInt(dropPrice),
    };
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    };
    console.log(requestOptions);
    fetch("https://webir-g06.herokuapp.com/product", requestOptions)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());
        if (response.ok) {
          this.setState({
            requestResult: "Operacion exitosa",
            showPopup: true,
          });
        } else {
          this.setState({
            requestResult: "Error de operación",
            showPopup: true,
          });
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
      })
      .catch((error) => {
        this.setState({ requestResult: "Error de operación", showPopup: true });
        console.error("There was an error!", error);
      });
  }

  render() {
    const { notificationType } = this.state;
    const { email } = this.state;
    const { precio } = this.state;
    console.log(this.state.price);
    return (
      <li>
        <div className="row p-2 bg-white border rounded spaceItem">
          <div className="col-md-3 mt-1">
            <img
              className="img-fluid img-responsive rounded product-image"
              src={this.props.thumbnail}
              alt="img fecheada"
            ></img>
          </div>
          <div className="col-md-6 mt-1">
            <h5>{this.props.title}</h5>
            <div className="d-flex flex-row"></div>
            <div className="mt-1 mb-1 spec-1">
              <span>Alguna propiedad?</span>
              <span className="dot"></span>
              <span>Otra propiedad?</span>
            </div>
            <div className="mt-1 mb-1 spec-1">
              <span>Departamento?</span>
            </div>
            <p className="text-justify text-truncate para mb-0">
              Alguna descripcion del producto? Publicidad paga?<br></br>
            </p>
            <button
              onClick={(ev) => {
                ev.preventDefault();
                window.window.open(this.props.permalink);
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm mt-2 App-link vinculoML"
              type="button"
            >
              Ver publicación en ML
            </button>
          </div>
          <div className="align-items-center align-content-center col-md-3 border-left mt-1">
            <div className="d-flex flex-row align-items-center">
              <h4 className="mr-1">
                {this.props.currency} {this.props.price}
              </h4>
              {(this.props.original_price != null) ?
              <span className="strike-text">
                {" "}
                {this.props.currency}
                {" "}
                {this.props.original_price}
              </span> : 
              ""}
              {(this.props.original_price != null) ?
                <h6 className="text-success">
                  <span className="textStyle">{100-Math.floor((parseInt(this.props.price)*100)/parseInt(this.props.original_price))}% OFF</span>
                </h6> : 
              ""}
            </div>
            <h6 className="text-success">
              {this.props.free_shipping != null && this.props.free_shipping ? (
                "Envio gratuito"
              ) : (
                <span className="strike-text">Envio gratuito</span>
              )}
            </h6>
            <div className="d-flex flex-column mt-4">
              <div></div>
              <div>
                <input
                  onChange={(e) => this.setState({ email: e.target.value })}
                  value={email}
                  className="search"
                  type="search"
                  placeholder="Email"
                ></input>
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value === "any_drop")
                    this.setState({
                      precio: this.props.price,
                      notificationType: "any_drop",
                    });
                  else this.setState({ notificationType: e.target.value });
                }}
                value={notificationType}
                style={{ maxWidth: "100%" }}
                placeholder="Tipo de notificacion"
              >
                <option value="drop_price">
                  Notificar si baja a menos de...
                </option>
                <option value="any_drop">
                  Notificar ante cualquier baja de precio
                </option>
              </select>
              <div>
                <input
                  onChange={(e) => this.setState({ precio: e.target.value })}
                  value={precio}
                  className="search"
                  disabled={this.state.notificationType === "any_drop"}
                  type="number"
                  placeholder="Precio"
                ></input>
              </div>

              <button
                onClick={() =>
                  this.sendSuscription(email, this.props.id, precio)
                }
                className="btn btn-primary btn-sm"
                type="button"
              >
                Suscribirse al producto
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
