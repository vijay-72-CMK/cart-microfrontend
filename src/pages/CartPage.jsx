import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Image, Table } from "react-bootstrap";
import axios from "axios";
import styles from "./CartPage.module.css";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let counter = 0;
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

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
        if (isDelete) {
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
          <Row>
            <Col md={12}>
              <h1 className={styles.cartTitle}>Your Shopping Cart</h1>
              {cartItems.length === 0 ? (
                <h1 className="no-items product">No Items in Cart</h1>
              ) : (
                <Table className={styles.cartTable}>
                  <thead>
                    <tr>
                      <th className={styles.centerContent}></th>
                      <th className={styles.centerContent}>Product Name</th>
                      <th className={styles.centerContent}>Price</th>
                      <th className={styles.centerContent}>Quantity</th>
                      <th className={styles.centerContent}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td className={styles.centerContent}>
                          <div className={styles.trashAndImage}>
                            {" "}
                            {/* Container */}
                            <Button
                              variant="light"
                              className={styles.deleteButton}
                              onClick={() =>
                                handleCartChange(item, false, true)
                              }
                            >
                              <RxCross2 color="black" size={24} />{" "}
                            </Button>
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              className={styles.cartImage}
                              fluid
                            />
                          </div>
                        </td>
                        <td className={styles.centerContent}>{item.name}</td>
                        <td className={styles.centerContent}>${item.price}</td>
                        <td className={styles.centerContent}>
                          <div className={styles.quantityControls}>
                            <Button
                              variant="outline-secondary"
                              className={styles.quantityButton}
                              onClick={() => handleCartChange(item, false)}
                              disabled={item.quantity <= 1}
                            >
                              <FaMinusCircle size={20} />
                            </Button>
                            <span className="cart-item-quantity">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline-secondary"
                              className={styles.quantityButton}
                              onClick={() => handleCartChange(item)}
                            >
                              <FaPlusCircle size={20} />
                            </Button>
                          </div>
                        </td>
                        <td className={styles.centerContent}>
                          ${item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <div className={styles.totalPriceDisplay}>
                Total: ${calculateTotalPrice()}
              </div>
            </Col>
          </Row>
          {/* <Row>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <h2>Cart Summary</h2>
                  <div className="d-flex justify-content-between">
                    <h4>Total Price:</h4>
                    <h3>${calculateTotalPrice()}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row> */}
        </>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={2000} // Timeout
      />
    </Container>
  );
};

export default Cart;
