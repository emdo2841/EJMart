import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  HStack,
  IconButton,
  Image,
  CircularProgress,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { FaStar } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/CartContext";
import AddReview from "./AddReview";
import api from "../context/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/product/${id}`);
      setProduct(res.data.data);
      setSelectedImage(res.data.data.images?.[0] || null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < rating ? "#F6AD55" : "#E2E8F0"} />
    ));

  const handleDelete = async () => {
    try {
      await api.delete(`/product/${product._id}`, { withCredentials: true });
      toast({
        title: "Deleted",
        description: "Product has been deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading)
    return (
     <Center flexDirection="column" p={4} minH="80vh">
      <CircularProgress isIndeterminate color="blue.400" size="80px" />
      </Center>
    );

  if (error)
    return (
      <Center h="100vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );

  return (
    <Container maxW="6xl" py={10}>
      <Flex direction={{ base: "column", md: "row" }} gap={10}>
        <Box flex={1}>
          <Image
            src={selectedImage}
            alt={product.name}
            rounded="md"
            objectFit="cover"
            w="100%"
            maxH="400px"
            cursor="pointer"
            onClick={() => {
              setModalImage(selectedImage);
              onOpen();
            }}
          />
          <HStack mt={4} spacing={2} overflowX="auto">
            {product.images.map((img, i) => (
              <Image
                key={i}
                src={img}
                boxSize="70px"
                objectFit="cover"
                border={
                  selectedImage === img ? "2px solid teal" : "1px solid gray"
                }
                borderRadius="md"
                cursor="pointer"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </HStack>
        </Box>

        <Box flex={1} bg={cardBg} p={6} rounded="md" shadow="md">
          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
            {product.name}
          </Text>
          <HStack mt={2}>{renderStars(product.averageRating || 0)}</HStack>

          <Text mt={4} fontSize="lg" color="green.500" fontWeight="bold">
            NGN {product.discountedPrice}
            <Text
              as="span"
              ml={2}
              color="gray.500"
              textDecoration="line-through"
            >
              NGN {product.price}
            </Text>
          </Text>

          <Text fontSize="sm" color="red.400" mt={1}>
            {product.discountPercentage?.toFixed(2)}% off
          </Text>

          <Text mt={4}>{product.description}</Text>

          <Flex gap={3} mt={6} wrap="wrap">
            <Button colorScheme="green" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
            {user?.role === "admin" && (
              <>
                <IconButton
                  icon={<MdEdit />}
                  aria-label="Edit"
                  onClick={() => navigate(`/update-product/${product._id}`)}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete"
                  colorScheme="red"
                  onClick={() => setIsDialogOpen(true)}
                />
              </>
            )}
          </Flex>
        </Box>
      </Flex>

      <Divider my={10} />

      <Box>
        <Text fontSize="2xl" mb={4}>
          Customer Reviews
        </Text>
        {product.reviews?.length > 0 ? (
          <>
            {product.reviews.slice(0, visibleReviews).map((review, idx) => (
              <Box key={idx} p={4} mb={4} bg={cardBg} rounded="md" shadow="sm">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold">
                    {review.user?.fullName || "Anonymous"}
                  </Text>
                  <HStack>{renderStars(review.rating)}</HStack>
                </Flex>
                <Text mt={2}>{review.comment}</Text>
                <Text fontSize="xs" mt={1} color="gray.500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </Box>
            ))}
            {visibleReviews < product.reviews.length && (
              <Button onClick={() => setVisibleReviews((v) => v + 3)} size="sm">
                Show More
              </Button>
            )}
          </>
        ) : (
          <Text>No reviews yet.</Text>
        )}

        {!loading && user && (
          <Box mt={6}>
            <AddReview productId={product._id} onSuccess={fetchProduct} />
          </Box>
        )}
      </Box>

      {/* Delete Alert */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Product</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This action can't be undone.
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
        <ModalContent bg="blackAlpha.800" p={0}>
          <ModalCloseButton color="white" />
          <ModalBody p={0}>
            <Image
              src={modalImage}
              alt="modal preview"
              objectFit="contain"
              w="100%"
              maxH="80vh"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProductDetails;
