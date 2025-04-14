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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    image: null,
  });

  const [error, setError] = useState("");

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
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Registration failed",
        description:
          error.response?.data?.message || "Something went wrong during signing up",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
      <Heading mb={2} textAlign="center" size="md">
        Sign Up
      </Heading>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
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
