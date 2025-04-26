import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "./context/api"; // Axios instance

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send email to backend to request password reset
      const response = await api.post("/auth/forgot-password", { email });

      if (response.data.message) {
        toast({
          title: "Password Reset Email Sent",
          description: response.data.message,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/login"); // Redirect to login or another page
      }
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minHeight="80vh" justify="center" align="center" bg="gray.50">
      <Box
        w={["70%", "60%", "400px"]}
        mx="auto"
        p={6}
        boxShadow="md"
        borderRadius="md"
      >
        <Heading mb={6} textAlign="center">
          Forgot Password
        </Heading>

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              Submit
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default ForgotPassword;
