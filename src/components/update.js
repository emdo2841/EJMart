// components/UpdateProductFields.jsx
import {
  Box,
  Button,
  Center,
  FormLabel,
  Input,
  Text,
  Select,
  CircularProgress,
  Stack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../context/api";

const UpdateProductFields = () => {
  const { productId } = useParams();
  const { register, handleSubmit, reset } = useForm();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, brandRes] = await Promise.all([
          api.get(`/product/${productId}`),
          api.get("/category?page=1&limit=100"),
          api.get("/brand?page=1&limit=100"),
        ]);

        reset({
          ...prodRes.data,
          category: prodRes.data.category?._id,
          brand: prodRes.data.brand?._id,
        });
        setCategories(catRes.data.data);
        setBrands(brandRes.data.data);
      } catch (err) {
        setError(err.message || "Failed to load data");
        toast({
          title: "Failed to load product data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [productId, reset, toast]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put(`/product/${productId}`, data);
      toast({
        title: "Product fields updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/product/${productId}`);
    } catch (err) {
      console.log(err)
      toast({
        title: "Update failed",
        description: err.response?.data?.details || err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <Center flexDirection="column" p={4} minH="80vh">
            <CircularProgress isIndeterminate color="blue.400" size="80px" />
            </Center>
    );
  if (error)
        return(
          <Center minH="80vh"><Text>error: {error} try Again please</Text></Center>)
  return (
    <Center>
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        p={6}
        mt={10}
        w={["80%", "70%", "500px"]}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="lg"
        bg={bg}
        borderColor={border}
        mb="120px"
        spacing="2"
        mx="auto"
        m={10}
        bgRepeat="no-repeat"
        bgSize="cover"
        bgImage="url(https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688550.jpg?uid=R111967752&ga=GA1.1.617246776.1748393573&semt=ais_hybrid&w=740)"
      >
        <Stack
          spacing="2"
        
        >
          <FormLabel>Name</FormLabel>
          <Input {...register("name")} />

          <FormLabel>Description</FormLabel>
          <Input {...register("description")} />

          <FormLabel>Price</FormLabel>
          <Input type="number" step="0.01" {...register("price")} />

          <FormLabel>Discounted Price</FormLabel>
          <Input type="number" step="0.01" {...register("discountedPrice")} />

          <FormLabel>Stock</FormLabel>
          <Input type="number" {...register("stock")} />

          <FormLabel>Color</FormLabel>
          <Input {...register("color")} />

          <FormLabel>Size</FormLabel>
          <Input {...register("size")} />

          <FormLabel>Category</FormLabel>
          <Select {...register("category")}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <FormLabel>Brand</FormLabel>
          <Select {...register("brand")}>
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </Select>

          <Button colorScheme="blue" type="submit" isLoading={loading}>
            Update Fields
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default UpdateProductFields;
