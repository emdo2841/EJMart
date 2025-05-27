// import React, { useState } from "react";
// import api from "./context/api"

// const ResetPassword = ({ token }) => {
//   const [password, setPassword] = useState(""); // State to store new password
//   const [message, setMessage] = useState(""); // State to show success message
//   const [error, setError] = useState(""); // State to show error message

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const response = await api.post(`/auth/forgot-password/${token}`, { password });
//       const data = await response.json();

//       if (data.ok) {
//         setMessage(data.message);
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h2>Reset Password</h2>
//       {message && <p style={{ color: "green" }}>{message}</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="Enter new password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Reset Password</button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;
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
import { useNavigate, useParams } from "react-router-dom";
import api from "../context/api"; // Axios instance

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);

    try {
      // Send email to backend to request password reset
      const response = await api.post(`/auth/reset-password/${token}`, { password });

      if (response.data.message) {
        toast({
          title: "Password Changed successfully",
          description: response.data.message,
          status: "success",
          duration: 3000,
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
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

export default ResetPassword;
