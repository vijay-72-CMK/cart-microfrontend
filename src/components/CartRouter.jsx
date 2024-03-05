import { Routes, Route } from "react-router-dom";
import CartPage from "../pages/CartPage.jsx";
import React from "react";

const BRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<CartPage />} />
    </Routes>
  );
};

export default BRouter;
