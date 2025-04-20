import api from "./context/api";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Image,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(21); // Number of products per page
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          `/product?page=${page}&limit=${limit}`,
          {}
        );

        console.log("✅ Response Data:", response.data);
        setProducts(response.data.data || []);
        setTotalProducts(response.data.total || 0); // Assuming API returns total count
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, limit]);
  if (loading) {
    return (
      <Center p={4}>
        <Box
          as="div"
          border="4px solid transparent"
          borderTop="4px solid #48BB78"
          borderRadius="50%"
          width="50px"
          height="50px"
          animation={`${spinAnimation} 1.5s linear infinite`}
        />
      </Center>
    );
  }

  if (error) return <p>Error: {error}</p>;

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <Center flexDir="column" p="4">
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        Products
      </Text>
      {products.length > 0 ? (
        <Grid
          templateColumns={{
            base: "repeat(3, 1fr)", // 👈 2 items per row on very small screens
            sm: "repeat(3, 1fr)", // 👈 3 per row on small screens
            md: "repeat(4, 1fr)", // 👈 4 on medium
            lg: "repeat(5, 1fr)", // 👈 5 on large
            xl: "repeat(7, 1fr)", // 👈 6 on XL if needed
          }}
          gap={4}
          w="full"
          maxW="1200px"
          p={{ base: "2", md: "4" }}
        >
          {products.map((product) => (
            <GridItem
              key={product._id}
              p="2"
              borderWidth="1px"
              borderColor="gray.300"
              borderRadius="md"
              textAlign="center"
              minH="200px"
              shadow="md"
              transition="all 0.2s"
              _hover={{ shadow: "lg", transform: "scale(1.02)" }}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                boxSize={{ base: "50px", sm: "60px", md: "80px" }}
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
                onClick={() => addToCart(product)} // Add product to cart
                mt="1"
                size="xs"
              >
                Add to Cart
              </Button>
              <Button
                colorScheme="green"
                onClick={() => navigate(`/product/${product._id}`)}
                mt="1"
                size="xs"
              >
                View
              </Button>
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Text>No products found</Text>
      )}

      {/* Pagination Controls */}
      <Box
        mt="4"
        display="flex"
        flexDirection={{ base: "column", sm: "row" }}
        alignItems="center"
        justifyContent="center"
        gap="2"
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
