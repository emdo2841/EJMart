import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  Input,
  VStack,
  Heading,
  Alert,
  useColorModeValue,
  AlertIcon,
  useToast,
  Flex,
  FormLabel
} from "@chakra-ui/react";
import FileUploadPreview from "./fileUploadPreview"; // Import the updated component
import api from "./context/api";
import PasswordInput from "./components/PasswordInput"; // Import the PasswordInput component 

const Form = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const cardBg = useColorModeValue("gray.50", "gray.800");
    const cardBorder = useColorModeValue("gray.200", "gray.600");
    // const textColor = useColorModeValue("gray.700", "gray.200");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    image: null,
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if the user is online
    if (!window.navigator.onLine) {
      setError("No internet connection. Please check your network.");
      return; // Exit early if there's no connection
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      const res = await api.post("/auth/register", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast({
          title: "Success!",
          description: res.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          address: "",
          phone: "",
          image: null,
        });
        setError({});
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message;

      // Match known server messages to fields
      if (message.includes("email")) {
        setError({ email: message });
      } else if (message.includes("Password")) {
        setError({ password: message });
      } else if (message.includes("phone")) {
        setError({ phone: message });
      } else if (message.includes("fill all fields")) {
        setError({ form: message });
      } else {
        setError({ form: message || "An unknown error occurred" });
      }
    }
  }

  return (
    <Flex
      minHeight="100vh"
      justify="center"
      align="center"
      bg={cardBg} // optional background
      mb="40px"
    >
      <Box
        w={["70%", "60%", "400px"]}
        mx="auto"
        p={6}
        boxShadow="md"
        borderRadius="md"
        bg={cardBg}
        borderColor={cardBorder}
        mt="4px"
        mb="60px"
        
      >
        <Heading mb={2} textAlign="center" size="md">
          Sign Up
        </Heading>

        {error.form && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error.form}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            {error.fullName && (
              <Alert status="error" fontSize="sm" mb={1} p={2}>
                <AlertIcon />
                {error.fullName}
              </Alert>
            )}
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                placeholder="Enter full name"
                size="sm"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </FormControl>

            {error.email && (
              <Alert status="error" fontSize="sm" mb={1} p={2}>
                <AlertIcon />
                {error.email}
              </Alert>
            )}
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Enter email"
                size="sm"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>

            {error.password && (
              <Alert status="error" fontSize="sm" mb={1} p={2}>
                <AlertIcon />
                {error.password}
              </Alert>
            )}
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <PasswordInput
                placeholder="Enter password"
                size="sm"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </FormControl>

            {error.address && (
              <Alert status="error" fontSize="sm" mb={1} p={2}>
                <AlertIcon />
                {error.address}
              </Alert>
            )}
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                placeholder="Enter address"
                type="text"
                size="sm"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </FormControl>

            {error.phone && (
              <Alert status="error" fontSize="sm" mb={1} p={2}>
                <AlertIcon />
                {error.phone}
              </Alert>
            )}
            <FormControl isRequired>
              <FormLabel>Telephone</FormLabel>
              <Input
                placeholder="Enter phone number"
                type="tel"
                size="sm"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Picture</FormLabel>
              <FileUploadPreview
                setImage={(img) =>
                  setFormData((prev) => ({ ...prev, image: img }))
                }
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Sign Up
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};
export default Form;
