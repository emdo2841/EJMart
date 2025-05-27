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
import { useNavigate} from "react-router-dom";
import api from "../context/api"; // Axios instance

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
        const response = await api.put(`/auth/update-password`, { oldPassword, newPassword });

      if (response.data.message) {
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
        }
        toast({
          title: "Password Changed successfully",
          description: response.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/profile"); // Redirect to login or another page
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
          Reset Password
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
              <FormLabel>Old Password</FormLabel>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

export default UpdatePassword;
