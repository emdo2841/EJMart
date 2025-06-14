import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  Checkbox,
  useToast,
  Flex
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../context/api";
import { AuthContext } from "../context/authContext";

const LoginForm = () => {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] =useState(false)
  const toast = useToast();
  const navigate = useNavigate();
  const cardBg = useColorModeValue("gray.50", "gray.800");
    // const cardBorder = useColorModeValue("gray.200", "gray.600");
    // const textColor = useColorModeValue("gray.700", "gray.200");

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
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minHeight="80vh"
      justify="center"
      align="center"
     
    >
      <Box
        w={["70%", "60%", "400px"]}
        mx="auto"
        p={6}
        boxShadow="md"
        borderRadius="md"
        bg={cardBg}
        bgRepeat="no-repeat"
        bgSize="cover"
        bgImage="url(https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688550.jpg?uid=R111967752&ga=GA1.1.617246776.1748393573&semt=ais_hybrid&w=740)"
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

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              Login
            </Button>
          </VStack>
        </form>

        <Button
          colorScheme="blue"
          onClick={() => navigate(`/forget-password`)}
          width="full"
          mt={4}
          // isLoading={loading}
        >
          Forget Password?
        </Button>
      </Box>
    </Flex>
  );
};

export default LoginForm;
