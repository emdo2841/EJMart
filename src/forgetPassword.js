import React, { useState, useContext } from "react";
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
  Flex
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "./context/api";
import { AuthContext } from "./context/authContext";

const ForgetPassword = () => {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: ""
  });
  const [error, setError] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData({ ...formData, [name]: value });
   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post(
        "/auth/forgot-password",
        {
          email: formData.email
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast({
          title: "reset link and toke sent to your email",
          description: "Please check your inbox",
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        setUser(res.data.user);
        navigate("/reset-passord"); // redirect after login
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" width="full">
                Login
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    );
};

export default ForgetPassword;