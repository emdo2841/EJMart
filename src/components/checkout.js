// src/components/Checkout.js
import React, { useState } from "react";
import {
  Box, 
  Button,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Flex
} from "@chakra-ui/react";
import { useCart } from "../context/CartContext";
import api from "../context/api"; // Adjust the import path as necessary

const Checkout = ({ user }) => {
  const { cart } = useCart();
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleCheckout = async () => {
    if (!email || !address) {
      toast({
        title: "Missing Fields",
        description: "Please provide email and address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare payload
      const payload = {
        user: user.id, // based on your AuthContext setup,
        email,
        address,
        products: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      };

      const res = await api.post(
        `/transact`,
        payload
      );

      const { data } = res;

      if (data?.paystack?.data?.authorization_url) {
        // Redirect to Paystack
        window.location.href = data.paystack.data.authorization_url;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Payment Error",
        description: error.response?.data?.error || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minHeight="80vh"
      justify="center"
      align="center"
      bg="gray.50" // optional background
    >
      <Box
        w={["70%", "60%", "400px"]}
        mx="auto"
        mt={10}
        p={4}
        boxShadow="md"
        borderRadius="md"
      >
        <Heading size="md" mb={4} textAlign="center">
          Checkout
        </Heading>
        <VStack spacing={3}>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={!!user?.email}
          />
          <Input
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            colorScheme="teal"
            onClick={handleCheckout}
            isLoading={loading}
          >
            Pay Now
          </Button>
          <Text fontSize="sm" color="gray.500">
            You’ll be redirected to Paystack to complete the payment.
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Checkout;
