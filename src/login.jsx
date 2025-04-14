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
  Checkbox,
  useToast,
  Flex
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "./context/api";
import { AuthContext } from "./context/authContext";

const LoginForm = () => {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );

      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken); // or use sessionStorage
        localStorage.setItem("refreshToken", res.data.refreshToken);

        setUser(res.data.user);
        toast({
          title: "Login successful",
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        navigate("/");
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
        Login
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
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormControl>
          <Checkbox
            name="rememberMe"
            isChecked={formData.rememberMe}
            onChange={handleChange}
          >
            Remember Me
          </Checkbox>

          <Button type="submit" colorScheme="blue" width="full">
            Login
          </Button>
        </VStack>
      </form>

      <Button
        colorScheme="blue"
        onClick={() => navigate(`/forget-password`)}
        width="full"
        mt={4}
      >
        Forget Password?
      </Button>
      </Box>
      </Flex>
  );
};

export default LoginForm;
