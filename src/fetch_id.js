import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Image,
  Spinner,
  Center,
  Text,
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import api from "./context/api";
import { useCart } from "./context/CartContext";
import AddReview from "./updateProduct";
import { useAuth } from "./context/authContext";
import { useColorModeValue } from "@chakra-ui/react";

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(3);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");


  const fetchProductById = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/product/${id}`);
      const productData = response.data.data;
      setProduct(productData);
      setSelectedImage(productData.images?.[0] || null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductById();
  }, [fetchProductById]);
  
 const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar
        key={i}
        color={i < rating ? "#FFD700" : "#E5E5E5"} // Gold or light gray
        style={{ marginRight: "2px" }}
      />
    );
  }
  return <HStack spacing="1">{stars}</HStack>; // Optional: clean spacing
};

  const handleImageClick = (img) => {
    const index = product.images.indexOf(img);
    setCurrentImageIndex(index);
    setModalImage(img);
    onOpen();
  };

  const handleNext = () => {
    const nextIndex = (currentImageIndex + 1) % product.images.length;
    setCurrentImageIndex(nextIndex);
    setModalImage(product.images[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex =
      (currentImageIndex - 1 + product.images.length) % product.images.length;
    setCurrentImageIndex(prevIndex);
    setModalImage(product.images[prevIndex]);
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text color="red.500">Error: {error}</Text>
      </Center>
    );
  }

  if (!product) {
    return (
      <Center h="100vh">
        <Text>Product not found</Text>
      </Center>
    );
  }

  return (
    <Container p="10" alignSelf="flex-start">
      <Box
        mt={6}
        p={4}
        bg={cardBg}
        border="1px solid"
        borderColor={cardBorder}
        borderRadius="md"
        textAlign="left"
        w="100%"
        maxW="sm"
        alignSelf="flex-start"
      >
        <VStack spacing={4}>
          {/* Main Image */}
          <Image
            src={selectedImage}
            alt={product.name}
            mx="auto"
            boxSize="300px"
            objectFit="cover"
            borderRadius="md"
            border="1px solid #ccc"
            cursor="pointer"
            onClick={() => handleImageClick(selectedImage)}
          />

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <>
              <Text fontSize="sm" color="gray.500">
                Click an image to view in fullscreen
              </Text>
              <HStack spacing={2} flexWrap="wrap">
                {product.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    boxSize="60px"
                    objectFit="cover"
                    borderRadius="md"
                    border={
                      img === selectedImage
                        ? "2px solid green"
                        : "1px solid #ccc"
                    }
                    cursor="pointer"
                    onClick={() => {
                      setSelectedImage(img);
                      handleImageClick(img);
                    }}
                    _hover={{ opacity: 0.8 }}
                  />
                ))}
              </HStack>
            </>
          )}

          {/* Product Info */}
          <Text fontSize="2xl" color={textColor} fontWeight="bold">
            {product.name}
          </Text>

          <Text>
            <Text as="span" color="green.600" fontWeight="bold">
              NGN {product.discountedPrice}
            </Text>
            <Text as="span" color="gray.500" textDecoration="line-through">
              NGN {product.price}
            </Text>{" "}
          </Text>

          <Text fontSize="sm" color="red.500">
            {product.discountPercentage?.toFixed(2)}% off
          </Text>

          <Text mt="2" fontSize="sm">
            {product.description || "No description provided."}
          </Text>
          <Text fontWeight="bold" mt="2" color={textColor}>
            {product.averageRating || "No rating yet."}
          </Text>

          {product.reviews?.length > 0 ? (
            <Box w="100%" mt="4">
              <Text fontWeight="bold" mb="2" color={textColor}>
                Customer Reviews:
              </Text>
              {product.reviews.slice(0, visibleReviews).map((review, idx) => (
                <Box key={idx} p="3" borderWidth="1px" borderRadius="md" mb="2">
                  <Text fontWeight="semibold">
                    {review.user?.fullName || "Anonymous"} –{" "}
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
            mt="1"
            size="xs"
          >
            Add to Cart
          </Button>
          {/* 
          <Button
            mt="4"
            colorScheme="blue"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button> */}
          {!loading && user && (
            <AddReview
              productId={product._id}
              onSuccess={fetchProductById}
            />
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
              <Text fontSize="md" color="gray.700" mb={2}>
                Want to leave a review?
              </Text>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => (window.location.href = "/login")}
              >
                Log In to Review
              </Button>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Modal Lightbox */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none" position="relative">
          <ModalCloseButton color="white" />

          {/* Arrows */}
          <Button
            position="absolute"
            left="0"
            top="50%"
            transform="translateY(-50%)"
            zIndex="1"
            onClick={handlePrev}
            bg="rgba(0,0,0,0.4)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.6)" }}
            size="sm"
            borderRadius="full"
          >
            &#8592;
          </Button>
          <Button
            position="absolute"
            right="0"
            top="50%"
            transform="translateY(-50%)"
            zIndex="1"
            onClick={handleNext}
            bg="rgba(0,0,0,0.4)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.6)" }}
            size="sm"
            borderRadius="full"
          >
            &#8594;
          </Button>

          <ModalBody p={0}>
            <Image
              src={modalImage}
              alt="Preview"
              w="100%"
              h="auto"
              maxH="80vh"
              objectFit="contain"
              borderRadius="lg"
              mx="auto"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProductDetails;
