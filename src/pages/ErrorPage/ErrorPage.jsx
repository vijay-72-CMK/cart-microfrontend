import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";

const ErrorPage = () => {
  return (
    <Container className="d-flex align-items-center min-vh-70">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={6} md={4} className="text-center">
          <Image src="500.svg" alt="500 Error Image" fluid />
          <p>A server error occurred (500).</p>
          <p>
            Please try again later or contact support if the issue persists.
          </p>
          <p>
            Go back to <Link to="/">homepage</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;
