import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./context/api";
import {
  Box,
  Image,
  Text,
  Heading,
  Stack,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  SimpleGrid,
  Button,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { useCart } from "./context/CartContext";
import AddReview from "./updateProduct";
import { useAuth } from "./context/authContext";

const ProductReviews = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleReviews, setVisibleReviews] = useState(3);
  const { user } = useAuth();
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const { addToCart } = useCart();

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${productId}/reviews`);
      setProduct(res.data);
    } catch (err) {
      setError("Failed to load product reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}/reviews`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);


  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          color={i < rating ? "#FFD700" : "#E5E5E5"}
          style={{ marginRight: "2px" }}
        />
      );
    }
    return <HStack spacing="1">{stars}</HStack>;
  };

  if (loading)
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );

  if (error)
    return (
      <Alert status="error" mt={6}>
        <AlertIcon />
        {error}
      </Alert>
    );

  if (!product) return <Text>Product not found.</Text>;

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <Heading mb={4}>{product.name}</Heading>
      <SimpleGrid columns={[2, 3]} spacing={4} mb={6}>
        {product.images?.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`Product Image ${idx}`}
            boxSize="150px"
            objectFit="cover"
            borderRadius="md"
            boxShadow="md"
          />
        ))}
      </SimpleGrid>
      <Heading size="md" mb={4}>
        Reviews
      </Heading>
      {product.reviews?.length > 0 ? (
        <Box w="100%" mt="4">
          <Text fontWeight="bold" mb="2" color={textColor}>
            Customer Reviews:
          </Text>
          <Stack spacing={3}>
            {product.reviews.slice(0, visibleReviews).map((review, idx) => (
              <Box key={idx} p="3" borderWidth="1px" borderRadius="md">
                <Text fontWeight="semibold">
                  {review.user?.name || "Anonymous"} –{" "}
                  {renderStars(review.rating)}
                </Text>
                <Text mt="1" color={textColor}>
                  {review.comment}
                </Text>
                <Text fontSize="xs" color="gray.500" mt="1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </Box>
            ))}
          </Stack>

          {visibleReviews < product.reviews.length && (
            <Button
              onClick={() => setVisibleReviews((prev) => prev + 3)}
              size="sm"
              variant="outline"
              colorScheme="blue"
              mt={2}
            >
              Show More Reviews
            </Button>
          )}

          {visibleReviews >= product.reviews.length &&
            product.reviews.length > 3 && (
              <Button
                onClick={() => setVisibleReviews(3)}
                size="sm"
                variant="outline"
                colorScheme="gray"
                mt={2}
              >
                Show Less
              </Button>
            )}
        </Box>
      ) : (
        <Text>No reviews yet.</Text>
      )}
      <Button
        colorScheme="green"
        onClick={() => addToCart(product)}
        mt="4"
        size="sm"
      >
        Add to Cart
      </Button>
      <Button mt="4" colorScheme="blue" onClick={() => window.history.back()}>
        Go Back
      </Button>
      {!loading && user && (
        <AddReview productId={product._id} onSuccess={fetchProduct} />
      )}
      {!loading && !user && (
        <Box
          mt={6}
          p={4}
          bg={cardBg}
          border="1px solid"
          borderColor={cardBorder}
          borderRadius="md"
          textAlign="center"
          w="100%"
        >
          <Stack spacing={2}>
            <Text fontSize="md" color="gray.700">
              Want to leave a review?
            </Text>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => (window.location.href = "/login")}
            >
              Log In to Review
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ProductReviews;
