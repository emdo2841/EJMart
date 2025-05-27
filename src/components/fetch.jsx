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
} from "@chakra-ui/react";
import { useCallback } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { keyframes } from "@emotion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/authContext";
import GlowingText from "./animation";

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Products = () => {
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const cancelRef = useRef();

 const fetchProducts = useCallback(async () => {
  try {
    let url = `/product?page=${page}&limit=${limit}`;
    if (q) url += `&search=${encodeURIComponent(q)}`;
    const response = await api.get(url);
    setProducts(response.data.data || []);
    setTotalProducts(response.data.total || 0);
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
}, [page, limit, q]);

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
      <Center p={4} height="100vh">
        <Box
          as="div"
          border="4px solid transparent"
          borderTop="4px solid #48BB78"
          borderRadius="50%"
          alignItems={"center"}
          width="50px"
          height="50px"

          animation={`${spinAnimation} 1.5s linear infinite`}
        />
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
    <Center flexDir="column" p="4" mb="15" mt="0" minH="100vh">
      {q && (
        <Text mb="4" fontSize="lg">
          {" "}
          Showing results for “{q}”{" "}
        </Text>
      )}
      <GlowingText />
      {products.length > 0 ? (
        <Center px={{ base: 2, md: 4 }}>
          <Grid
            templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            maxW={{
              base: "100%", // fallback for very small screens
              sm: "600px", // ≥ 480px
              md: "800px", // ≥ 768px
              lg: "1000px", // ≥ 992px
              xl: "1200px", // ≥ 1280px
            }}
            gap={6}
            justifyContent="center"
            spacing={6}
            p={{ base: "2", md: "4" }}
            mt="5 "
          >
            {products.map((product) => (
              <GridItem
                key={product._id}
                p="2"
                borderWidth="1px"
                border="none"
                borderColor="gray.300"
                borderRadius="md"
                textAlign="center"
                minH="150px"
                shadow="lg"
                transition="all 0.2s"
                _hover={{ shadow: "lg", transform: "scale(1.02)" }}
              >
                <Image 
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
                  <Text
                    as="span"
                    textDecoration="line-through"
                    color="gray.500"
                  >
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
                  m="1"
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
                    mt="1"
                    onClick={() => {
                      setSelectedId(product._id);
                      setIsDialogOpen(true);
                    }}
                  />
                )}
              </GridItem>
            ))}
          </Grid>
        </Center>
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

export default Products;

