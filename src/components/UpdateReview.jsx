import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
  Center,
  useToast,
  Flex,
  Heading,
} from "@chakra-ui/react";
import api from "../context/api"; // Adjust the path to your Axios instance
import {useAuth} from "../context/authContext"
import { useParams, useNavigate } from "react-router-dom";

const UpdateReview = ({ onSuccess }) => {
  const {productId} = useParams()
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const cardBg = useColorModeValue("gray.50", "gray.800");
  // const cardBorder = useColorModeValue("gray.200", "gray.600");
  // const textColor = useColorModeValue("gray.700", "gray.200");
  const navigate = useNavigate()
  const toast = useToast();
  const { user } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await api.put(`/product/review/${productId}`, {
        userId: user.id,
        rating: parseInt(rating, 10),
        comment,
      });

      if (res.data.success) {
        toast({
          title: "Success!",
          description: "Review update successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigate(`/product/${productId}`)
        if (onSuccess) onSuccess(); // <== Call this to trigger reload
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update the review."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minHeight="80vh"
      justify="center"
      align="center"
      bg={cardBg} // optional background
    >
      <Box
        w={["70%", "60%", "400px"]}
        mx="auto"
        p={6}
        boxShadow="md"
        borderRadius="md"
        bg={cardBg}
      >
        <Heading mb={2} textAlign="center" size="md">
          Update your Review
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired mb={4}>
            <FormLabel>Rating (1-5)</FormLabel>
            <Input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Enter rating"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Comment</FormLabel>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How do you feel about the product"
            />
          </FormControl>

          {loading ? (
            <Center>
              <Spinner size="lg" />
            </Center>
          ) : (
            <Button type="submit" colorScheme="blue" width="full">
              Add Review
            </Button>
          )}

          {successMessage && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
        </form>
      </Box>
    </Flex>
  );
 };
 
export default UpdateReview;