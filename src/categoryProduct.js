import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Select,
  Center,
  Alert,
  AlertIcon,
  Grid,
  GridItem,
  useColorModeValue,
  Stack,
  Image,
  Button,
  Icon,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaTags } from "react-icons/fa";
import api from "./context/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CategoryProductSelector = () => {
  const [categories, setCategories] = useState([]);
  const [selectedcategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(40);
  const [totalProducts, setTotalProducts] = useState(0);

  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await api.get(`/category?page=${page}&limit=${limit}`);
        setCategories(res.data.data);
      } catch (err) {
        setError("Failed to load categorys");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [page, limit]);

  const fetchProductsByCategory = async (categoryId) => {
    setLoadingProducts(true);
    setError("");
    try {
      const res = await api.get(
        `/category/category/${categoryId}?page=${page}&limit=${limit}`
      );
      setProducts(res.data.data);
      setTotalProducts(res.data.data.total || 0);
    } catch (err) {
      setError("Failed to load products for this category");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) fetchProductsByCategory(categoryId);
  };

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <Center
      flexDir="column"
      minH="100vh"
      p="6"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Text fontSize="2xl" fontWeight="bold" mb="4" textAlign="center">
        Products
      </Text>

      <Box
        w="full"
        maxW="1200px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={{ base: 4, md: 8 }}
        bg={useColorModeValue("white", "gray.700")}
        borderRadius="lg"
        shadow="md"
      >
        <Stack direction="row" align="center" mb={6} spacing={3}>
          <Icon as={FaTags} color="blue.500" boxSize={6} />
          <Heading fontSize={{ base: "xl", md: "2xl" }}>Categories</Heading>
        </Stack>

        {loadingCategories ? (
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
        ) : (
          <Select
            placeholder="Select a category"
            onChange={handleCategoryChange}
            mb={6}
            maxW={{ base: "100%", md: "400px" }}
            bg={bg}
            borderColor={border}
            shadow="md"
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
        )}

        {error && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {loadingProducts ? (
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
        ) : error ? (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        ) : (
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
              xl: "repeat(7, 1fr)",
            }}
            justifyContent="center"
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
                <Text fontSize="sm" color="gray.500">
                  Category: {product.category?.name || "N/A"}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Brand: {product.brand?.name || "N/A"}
                </Text>
              </GridItem>
            ))}
          </Grid>
        )}

        {!loadingProducts && products.length === 0 && selectedcategory && (
          <Text mt={6} fontSize="lg" color="gray.600" textAlign="center">
            No products found for this category.
          </Text>
        )}

        <Box
          mt="6"
          display="flex"
          flexDirection={{ base: "column", sm: "row" }}
          alignItems="center"
          justifyContent="center"
          gap="3"
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
      </Box>
    </Center>
  );
};

export default CategoryProductSelector;
