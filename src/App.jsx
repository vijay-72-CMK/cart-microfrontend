import React from "react";
import ReactDOM from "react-dom";
import CartRouter from "./components/CartRouter";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom";
const App = () => {
  <CartProvider>
    <BrowserRouter>
      <CartRouter />
    </BrowserRouter>
  </CartProvider>;
};
ReactDOM.render(<App />, document.getElementById("app"));
