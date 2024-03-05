import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Image } from "react-bootstrap";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  const handleIncrement = async (item) => {
    try {
      const response = await axios.post(
        "http://localhost:8082/api/cart/modify-cart",

        {
          productId: item.id,

          quantity: 1,
        },

        { withCredentials: true }
      );
      console.log("call made" + response);

      // Update state directly
      setCartItems(
        cartItems.map((cartItem) => {
          if (cartItem.id === item.id) {
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          }
          return cartItem; // No change for other items
        })
      );
      window.dispatchEvent(
        new CustomEvent("cart-item-added", {
          detail: { productId: item.id, quantity: 1 },
        })
      );
      console.log("Event dispatched: cart-item-added");
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  useEffect(() => {
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

        const productPromises = cartResponse.data.cartItems.map((item) =>
          axios.get(`http://localhost:8081/api/products/${item.productId}`, {
            withCredentials: true,
          })
        );

        const productResults = await Promise.all(productPromises);

        const enrichedCartItems = []; // Changed to an array

        cartResponse.data.cartItems.forEach((cartItem, index) => {
          enrichedCartItems.push({
            ...cartItem,
            ...productResults[index].data,
          });

          setCartItems(enrichedCartItems); // Update state after each item
        });
        console.log(enrichedCartItems);
      } catch (error) {
        console.error("Error fetching cart data in CART MF", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <Container>
      {isLoading ? (
        <p>Loading Cart Items...</p>
      ) : (
        <Row>
          <Col md={8}>
            {cartItems.length === 0 ? (
              <h1 className="no-items product">No Items in Cart</h1>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} className="mb-3">
                  <Row className="g-0">
                    <Col sm={4} md={3}>
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        className="cart-item-image"
                        fluid
                      />
                    </Col>
                    <Col sm={8} md={9}>
                      <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <p className="cart-item-price">${item.price}</p>
                        <div className="cart-item-controls">
                          <Button
                            variant="outline-secondary"
                            onClick={() => handleDecrement(item)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="cart-item-quantity">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline-secondary"
                            onClick={() => handleIncrement(item)}
                          >
                            +
                          </Button>
                          <Button
                            variant="danger"
                            className="ms-2"
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))
            )}
          </Col>
          <Col md={4}>
            <Card>
              {" "}
              {/* Card for the summary */}
              <Card.Body>
                <h2>Cart Summary</h2>
                <div className="d-flex justify-content-between">
                  <h4>Total Price:</h4>
                  <h3>${calculateTotalPrice()}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
