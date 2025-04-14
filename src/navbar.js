import { useNavigate, useLocation } from "react-router-dom";
import { Flex, Button } from "@chakra-ui/react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide "Products" link only on the /products page
  const hideProductsLink = location.pathname.startsWith("/product");

  return (
    <Flex as="nav" p="4" bg="gray.100" justify="space-between" wrap="wrap">
      <Button onClick={() => navigate("/")}>Home</Button>

      {!hideProductsLink && (
        <Button onClick={() => navigate("/products")}>Products</Button>
      )}

      <Button onClick={() => navigate("/login")}>Login</Button>
    </Flex>
  );
};

export default Navbar;
