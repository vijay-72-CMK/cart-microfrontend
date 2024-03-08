import { Routes, Route } from "react-router-dom";
import CartPage from "../pages/CartPage/CartPage.jsx";
import React from "react";
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";
import NotFoundPage from "../pages/NotFound/NotFound.jsx";
import CheckoutSuccess from "../pages/CheckOutSuccessPage/CheckoutSuccess.jsx";
const BRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<CartPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/checkout-success" element={<CheckoutSuccess />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default BRouter;
