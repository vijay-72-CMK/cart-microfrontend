import { Routes, Route } from "react-router-dom";
import CartPage from "../pages/CartPage.jsx";
import React from "react";
import ErrorPage from "../pages/ErrorPage/ErrorPage.jsx";
import NotFoundPage from "../pages/NotFound/NotFound.jsx";
const BRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<CartPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default BRouter;
