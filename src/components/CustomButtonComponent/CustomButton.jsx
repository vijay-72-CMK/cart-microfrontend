import Button from "react-bootstrap/Button";
import "./CustomButton.css";

function CustomButton({ children, size, onClick }) {
  return (
    <>
      <Button variant="flat" size={size} onClick={onClick}>
        {children}
      </Button>
    </>
  );
}

export default CustomButton;
