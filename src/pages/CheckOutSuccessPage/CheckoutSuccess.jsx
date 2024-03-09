import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Container, Row, Col, Image } from "react-bootstrap";
import "./CheckoutStyles.css";
import CustomButton from "../../components/CustomButtonComponent/CustomButton";

const CheckoutSuccess = () => {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const totalPrice = location.state?.totalPrice || 0;
  console.log(cartItems);
  return (
    <Container className="checkout-success-container">
      <h1>Order Placed Successfully!</h1>
      <p>Thank you for your order. Here's your order summary:</p>

      <div className="order-details">
        <h2>Order ID : 78623467</h2>
        {cartItems.map((item) => (
          <Card key={item.id} className="mb-3 border-0">
            <Card.Body className="cardBody">
              <Row>
                <Col md={2} className="p-0">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fluid
                    className="order-item-image"
                  />
                </Col>
                <Col
                  md={10}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <Card.Title className="cardTitle mb-4">
                      {item.name}
                    </Card.Title>
                    <div className="d-flex gap-4 priceContainer">
                      {Object.keys(item.attributes).map((key) => (
                        <Card.Text key={key}>
                          <span className="makeSentenceCase">{key}</span> :{" "}
                          {item.attributes[key]}
                        </Card.Text>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Card.Title className="text-align-right cardTitle mb-4 subTotal">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </Card.Title>
                    <div className="d-flex gap-3 m-0 p-0 priceContainer">
                      <Card.Text>Price: ${item.price}</Card.Text>
                      <Card.Text>Quantity: {item.quantity}</Card.Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="order-total mt-3 cardTitle">
        Total: ${totalPrice.toFixed(2)}
      </div>

      <div className="text-center mt-3">
        <Link to="/" className="continue-shopping-button">
          <CustomButton size="xxl">Continue Shopping</CustomButton>
        </Link>
      </div>
    </Container>
  );
};

export default CheckoutSuccess;
