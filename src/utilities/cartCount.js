// src/components/CartCount.js
import { useCart } from "../context/CartContext";
import { Box, Text } from "@chakra-ui/react";

const CartCount = () => {
  const { cart } = useCart();
  return (
    <Box position="relative">
      <Text fontSize="xm" fontWeight="medium" >Cart: {cart.length}</Text>
    </Box>
  );
};

export default CartCount;
