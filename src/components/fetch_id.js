import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
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
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { FaStar } from "react-icons/fa";
import api from "../context/api";
import { useCart } from "../context/CartContext";
import AddReview from "./AddReview";
import { useAuth } from "../context/authContext";
import { MdEdit } from "react-icons/md"; // Edit icon

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef();

  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const renderStars = (rating) => {
    return (
      <HStack spacing="1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            color={i < rating ? "#FFD700" : "#E5E5E5"}
            style={{ marginRight: "2px" }}
          />
        ))}
      </HStack>
    );
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/product/${product._id}`, { withCredentials: true });
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsDialogOpen(false);
      navigate("/");
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error.response?.data?.message || "Failed to delete product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
        <Text color="red.500">{error} please try again</Text>
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
    <Container p="14" alignSelf="flex-start" mt={{base:"-10", sm:"-10", md:"-8", lg:"-8", xl:"-8"}} mb={{ base:"8",sm:"8",md:"2"}} >
      <Box
        mt={6}
        p={4}
        // mb={8}
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
                    boxSize="80px"
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
                    transition="all 0.2s"
                    _hover={{ shadow: "lg", transform: "scale(1.02)" }}
                  />
                ))}
              </HStack>
            </>
          )}
          <Flex>
            {user?.role === "admin" && (
              <Tooltip label="Edit" hasArrow>
                <IconButton
                  icon={<MdEdit />}
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => {
                    navigate(`/add-product-image/${product._id}`);
                  }}
                  aria-label="add or edit image"
                />
              </Tooltip>
            )}
            {user?.role === "admin" && (
              <Tooltip label="Delete Images" hasArrow>
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => navigate(`/remove-image/${product._id}`)}
                  aria-label="delete images"
                />
              </Tooltip>
            )}
          </Flex>
          <Text fontSize="2xl" color={textColor} fontWeight="bold">
            {product.name}
          </Text>

          <Text>
            <Text as="span" color="green.600" fontWeight="bold">
              NGN {product.discountedPrice}
            </Text>{" "}
            <Text as="span" color="gray.500" textDecoration="line-through">
              NGN {product.price}
            </Text>
          </Text>

          <Text fontSize="sm" color="red.500">
            {product.discountPercentage?.toFixed(2)}% off
          </Text>

          <Text mt="2" fontSize="sm">
            {product.description || "No description provided."}
          </Text>

          <Text fontWeight="bold" mt="2" color={textColor}>
            Rating:
          </Text>
          {renderStars(product.averageRating || "No rating yet.")}

          {product.reviews?.length > 0 ? (
            <Box w="100%" mt="4">
              <Text fontWeight="bold" mb="2" color={textColor}>
                <Center>Customer Reviews</Center>
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
                  {user && review.user?._id === user.id && (
                    <Button
                      colorScheme="green"
                      onClick={() => navigate(`/update-review/${product._id}`)}
                      mt="1"
                      size="sm"
                    >
                      Update review
                    </Button>
                  )}
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
          <Flex>
            {user?.role === "admin" && (
              <Tooltip label="Edit" hasArrow>
                <IconButton
                  icon={<MdEdit />}
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => {
                    navigate(`/update-product/${product._id}`);
                  }}
                  aria-label="Edit"
                />
              </Tooltip>
            )}

            <Button
              colorScheme="green"
              onClick={() => addToCart(product)}
              mt="1"
              size="xs"
            >
              Add to Cart
            </Button>

            {user?.role === "admin" && (
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete Product"
                colorScheme="red"
                size="sm"
                mt="2"
                onClick={() => setIsDialogOpen(true)}
              />
            )}
          </Flex>

          {!loading && user && (
            <AddReview productId={product._id} onSuccess={fetchProductById} />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none" position="relative">
          <ModalCloseButton color="white" />
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
