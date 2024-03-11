import Button from "react-bootstrap/Button";
import "./CustomButton.css";

function CustomButton({ children, size, type, onClick, outline = false }) {
  return (
    <Button
      type={type}
      variant="flat"
      size={size}
      className={`d-flex justify-content-center ${outline ? "outline" : ""}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default CustomButton;
