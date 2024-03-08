import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";

const NotFoundPage = () => {
  return (
    <Container className="d-flex align-items-center min-vh-70">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={6} md={4} className="text-center">
          <Image src="404.svg" alt="404 Image" fluid />
          <p>Page not found</p>
          <p>
            Go back to <Link to="/">homepage</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
