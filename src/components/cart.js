import React from "react";
import {
  Box,
  Button,
  Center,
  //   Spinner,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useCart } from "../context/CartContext";

import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();
  if (cart.length === 0) {
    return (
      <Center h="100vh">
        <Text fontSize="xl">Your cart is empty</Text>
      </Center>
    );
  }

  return (
    <VStack spacing={4} p={4} height="100vh">
      {cart.map((item) => (
        <HStack
          key={item._id}
          w="full"
          justify="space-between"
          p={2}
          borderWidth="1px"
          borderRadius="md"
        >
          <Box>
            <Text fontWeight="bold">{item.name}</Text>
            <Text color="gray.600">
              NGN {item.discountedPrice} x {item.quantity}
            </Text>
          </Box>
          <HStack>
            <Button
              size="sm"
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              isDisabled={item.quantity <= 1}
            >
              -
            </Button>
            <Text>{item.quantity}</Text>
            <Button
              size="sm"
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
            >
              +
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => removeFromCart(item._id)}
            >
              Remove
            </Button>
          </HStack>
        </HStack>
      ))}

      <Text fontSize="lg" fontWeight="bold">
        Total: NGN {getTotalPrice()}
      </Text>
      <Button colorScheme="teal" onClick={() => navigate(`/transact`)}>
        Checkout
      </Button>
    </VStack>
  );
};

export default Cart;
