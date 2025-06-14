import api from "../context/api";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Image,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  IconButton,
  CircularProgress
} from "@chakra-ui/react";
import { useCallback } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/authContext";


const BrandProductSelector = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const [name, setName] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const cancelRef = useRef();
  const { id } = useParams();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get(
        `/brand/product/${id}?page=${page}&limit=${limit}`
      );
      const fetchedProducts = response.data.data || [];
      setProducts(fetchedProducts);
      setTotalProducts(response.data.total || 0);
      if (fetchedProducts.length > 0) {
        if (fetchedProducts[0].category?.name) {
          setName(fetchedProducts[0].category.name);
        } else {
          setName("Products"); // Fallback
        }
      } else {
        setName("Products");
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [id, page, limit]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    try {
      await api.delete(`/product/${selectedId}`, {
        withCredentials: true,
      });
      toast({
        title: "Product Deleted",
        description: `Product has been successfully deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsDialogOpen(false);
      setSelectedId(null);
      fetchProducts(); // Refresh after delete
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
      <Center flexDirection="column" p={4} minH="80vh">
            <CircularProgress isIndeterminate color="blue.400" size="80px" />
            </Center>

    );
  }

  if (error)
      return (
        <Center h="100vh">
          <Text color="red.500">{error} please try again!!!</Text>
        </Center>
      );

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <Center flexDir="column" p="4" minh="100vh">
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        {name}
      </Text>

      {products.length > 0 ? (
        <Grid
          templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          maxW={{
            base: "100%", // fallback for very small screens
            sm: "600px", // ≥ 480px
            md: "800px", // ≥ 768px
            lg: "1000px", // ≥ 992px
            xl: "1200px", // ≥ 1280px
          }}
          gap={5}
          justifyContent="center"
          p={{ base: "2", md: "4" }}
          mt="-4"
        >
          {products.map((product) => (
            <GridItem
              key={product._id}
              p="2"
              borderWidth="1px"
              borderColor="gray.300"
              border="none"
              borderRadius="md"
              textAlign="center"
              minH="150px"
              shadow="lg"
              transition="all 0.2s"
              _hover={{ shadow: "lg", transform: "scale(1.02)" }}
            >
              <Image
                w="50px"
                height="80px"
                src={product.images[0]}
                alt={product.name}
                boxSize={{ base: "70px", sm: "80px", md: "90px" }}
                objectFit="cover"
                mx="auto"
                mb="1"
              />
              <Text fontWeight="bold" fontSize="sm">
                {product.name}
              </Text>
              <Text fontSize="xs">
                <Text as="span" textDecoration="line-through" color="gray.500">
                  NGN {product.price}
                </Text>{" "}
                <Text as="span" fontWeight="bold" color="green.500">
                  NGN {product.discountedPrice}
                </Text>
              </Text>
              <Text fontSize="xs" color="red.500">
                {product.discountPercentage.toFixed(2)}% off
              </Text>
              <Button
                colorScheme="green"
                onClick={() => addToCart(product)}
                mt="1"
                size="xs"
              >
                Add to Cart
              </Button>
              <Button
                colorScheme="green"
                onClick={() => navigate(`/product/${product._id}`)}
                m="1"
                size="xs"
              >
                View
              </Button>
              {user?.role === "admin" && (
                <IconButton
                  aria-label="Delete Product"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  size="sm"
                  m="1"
                  onClick={() => {
                    setSelectedId(product._id);
                    setIsDialogOpen(true);
                  }}
                />
              )}
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Text>No products found</Text>
      )}

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

      {/* Pagination */}
      <Box
        mt="4"
        display="flex"
        flexDirection={{ base: "column", sm: "row" }}
        alignItems="center"
        justifyContent="center"
        gap="2"
        pb="20"
      >
        <Button
          isDisabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          width={{ base: "100%", sm: "auto" }}
        >
          Previous
        </Button>

        <Text fontSize="sm" mx="2">
          Page {page} of {totalPages}
        </Text>

        <Button
          onClick={() => setPage((prev) => prev + 1)}
          isDisabled={page >= totalPages}
          width={{ base: "100%", sm: "auto" }}
        >
          {page >= totalPages ? "Last" : "Next"}
        </Button>
      </Box>
    </Center>
  );
};

export default BrandProductSelector;
