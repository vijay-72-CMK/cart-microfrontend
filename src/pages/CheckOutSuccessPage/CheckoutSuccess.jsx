import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Container, Row, Col, Image } from "react-bootstrap";

const CheckoutSuccess = () => {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const totalPrice = location.state?.totalPrice || 0;

  return (
    <Container className="checkout-success-container">
      <h1>Order Placed Successfully!</h1>
      <p>Thank you for your order. Here's your order summary:</p>

      <div className="order-details">
        {cartItems.map((item) => (
          <Card key={item.id} className="mb-3">
            <Card.Body>
              <Row>
                <Col md={2}>
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fluid
                    className="order-item-image"
                  />
                </Col>
                <Col md={10}>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>Price: ${item.price}</Card.Text>
                  <Card.Text>Quantity: {item.quantity}</Card.Text>
                  <Card.Text className="fw-bold">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="order-total mt-3">Total: ${totalPrice.toFixed(2)}</div>

      <div className="text-center mt-3">
        <Link to="/">
          <button className="continue-shopping-button">
            Continue Shopping
          </button>
        </Link>
      </div>
    </Container>
  );
};

export default CheckoutSuccess;
