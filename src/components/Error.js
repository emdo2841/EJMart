import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({ message = "Page not found", status = 404 }) => {
  const navigate = useNavigate();

  // Themed colors
  const headingColor = useColorModeValue("red.500", "red.300");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const bgGradient = useColorModeValue(
    "linear(to-r, red.400, red.500)",
    "linear(to-r, red.300, red.500)"
  );

  return (
    <Box
      textAlign="center"
      py={12}
      px={6}
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
    >
      <VStack spacing={6}>
        <Heading fontSize="6xl" bgGradient={bgGradient} bgClip="text">
          {status}
        </Heading>

        <Text fontSize="2xl" fontWeight="semibold" color={headingColor}>
          {message}
        </Text>

        <Text color={subTextColor} maxW="lg" px={4}>
          Sorry, the page you're looking for doesn't exist or an error occurred.
        </Text>

        <Button colorScheme="red" size="lg" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default ErrorPage;
