import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Image, Table } from "react-bootstrap";
import axios from "axios";
import styles from "./CartPage.module.css";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { BsCartX } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButtonComponent/CustomButton";
import DeleteIcon from "../../../public/delete.svg";
import CheckoutIcon from "../../../public/checkout.svg";
let counter = 0;
const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!storedIsLoggedIn) {
    navigate("/login", { replace: true });
  }

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8082/api/cart/delete-cart",
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Order placed successfully!");
        const cartCount = localStorage.getItem("cartCount") || 0;

        window.dispatchEvent(
          new CustomEvent("cart-change", {
            detail: { productId: "full clear", quantity: -cartCount },
          })
        );

        navigate("/cart/checkout-success", {
          state: { cartItems, totalPrice: calculateTotalPrice() },
        });
      } else {
        toast.error("Error placing order. Please try again.");
      }
    } catch (error) {
      console.error("Error checking out:", error);
      toast.error("Error placing order. Please try again.");
      navigate("/error", { replace: true });
    }
  };

  const SHIPPING_FEE = 10;
  const TAX_RATE = 0.07;

  const handleCartChange = async (
    item,
    isIncrement = true,
    isDelete = false
  ) => {
    try {
      const quantityChange = isIncrement ? 1 : isDelete ? -item.quantity : -1;

      const response = await axios.post(
        "http://localhost:8082/api/cart/modify-cart",
        {
          productId: item.id,
          quantity: quantityChange,
        },
        { withCredentials: true }
      );

      setCartItems((cartItems) => {
        if (isDelete || (item.quantity == 1 && !isIncrement)) {
          return cartItems.filter((cartItem) => cartItem.id !== item.id);
        } else {
          return cartItems.map((cartItem) => {
            if (cartItem.id === item.id) {
              return {
                ...cartItem,
                quantity: cartItem.quantity + quantityChange,
              };
            }
            return cartItem;
          });
        }
      });

      window.dispatchEvent(
        new CustomEvent("cart-change", {
          detail: { productId: item.id, quantity: quantityChange },
        })
      );
      console.log("Event dispatched");
      const operationType = isDelete
        ? "deleted"
        : isIncrement
        ? "incremented"
        : "decremented";
      toast.success(`Item ${operationType} successfully!`);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Error updating cart");
      navigate("/error", { replace: true });
    }
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const cartResponse = await axios.get(
        "http://localhost:8082/api/cart/view-cart",
        { withCredentials: true }
      );

      if (cartResponse.data.cartItems.length === 0) {
        setIsLoading(false);
        return;
      }
      console.log(cartResponse.data);

      const productResults = await Promise.all(
        cartResponse.data.cartItems.map((item) =>
          axios.get(`http://localhost:8081/api/products/${item.productId}`, {
            withCredentials: true,
          })
        )
      );

      const enrichedCartItems = [];

      cartResponse.data.cartItems.forEach((cartItem, index) => {
        enrichedCartItems.push({
          ...cartItem,
          ...productResults[index].data,
        });
      });
      setCartItems(enrichedCartItems);

      console.log(enrichedCartItems);
    } catch (error) {
      console.error("Error fetching cart data in CART MF", error);
      if (!error.response || error.response.status == 500) {
        navigate("/error", { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log("Hello I am cart page, getting rendered I guess", ++counter);
  return (
    <Container className={styles.pageContent}>
      {isLoading ? (
        <p>Loading Cart Items...</p>
      ) : (
        <>
          {cartItems.length > 0 && (
            <Row>
              <Col md={12}>
                <h1 className="text-center mb-3">Your Cart</h1>
              </Col>
            </Row>
          )}
          <Row className={styles.contentRow}>
            <Col md={8}>
              {cartItems.length === 0 ? (
                <div className={styles.emptyCartContainer}>
                  <BsCartX size={100} color="#6d0d16" />{" "}
                  <h1 className="no-items product">No Items in Cart</h1>
                </div>
              ) : (
                <>
                  <div className={styles.productGrid}>
                    <p></p>
                    <p className={styles.header}>Product Name</p>
                    <p className={styles.header}>Price per unit</p>
                    <p className={styles.header}>Quantity</p>
                    <p className={styles.header}>Subtotal</p>
                    {cartItems.map((item) => (
                      <>
                        <div className={styles.trashAndImage}>
                          <Link to={`/products/${item.id}`}>
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              className={styles.cartImage}
                              fluid
                            />
                          </Link>
                        </div>
                        <Link
                          to={`/products/${item.id}`}
                          className={styles.productLink}
                        >
                          {item.name}
                        </Link>
                        <p className={styles.priceContainer}>${item.price}</p>
                        <div className={styles.quantityControls}>
                          <div
                            className={styles.quantityButton}
                            onClick={() => handleCartChange(item, false)}
                          >
                            <span>-</span>
                          </div>
                          <span className="cart-item-quantity">
                            {item.quantity}
                          </span>
                          <div
                            variant="outline-secondary"
                            className={styles.quantityButton}
                            onClick={() => handleCartChange(item)}
                          >
                            <span>+</span>
                          </div>
                        </div>
                        <div className={styles.totalValue}>
                          <span>${item.price * item.quantity}</span>
                          <Button
                            variant="none"
                            className={styles.deleteButton}
                            onClick={() => handleCartChange(item, false, true)}
                          >
                            <Image src={DeleteIcon} />
                          </Button>
                        </div>
                      </>
                    ))}
                  </div>
                </>
              )}
            </Col>
            {cartItems.length > 0 && (
              <Col md={4}>
                <div className={styles.summaryCard}>
                  <h3>Cart Summary</h3>
                  <div className={styles.summaryItem}>
                    <span>Subtotal</span>
                    <span>${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Shipping</span>
                    <span>${SHIPPING_FEE.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Tax</span>
                    <span>
                      ${(calculateTotalPrice() * TAX_RATE).toFixed(2)}
                    </span>
                  </div>
                  <hr /> {/* Simple divider */}
                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>
                      $
                      {(
                        calculateTotalPrice() +
                        SHIPPING_FEE +
                        calculateTotalPrice() * TAX_RATE
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.checkoutButtonContainer}>
                    <CustomButton size="lg" onClick={handleCheckout}>
                      Checkout
                    </CustomButton>
                  </div>
                </div>
                <Image src={CheckoutIcon} />
              </Col>
            )}
          </Row>
        </>
      )}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Container>
  );
};

export default Cart;
