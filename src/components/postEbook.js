import {
  Center,
  Stack,
  FormLabel,
  Input,
  Button,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import FileUploadPreview from "../utilities/FileUploadPreview";
// import { useDropzone } from "react-dropzone";
import api from "../context/api";
import { useAuth } from "../context/authContext";

function EbookForm() {
  const { user } = useAuth();

  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    images: null,
    color: "",
    size: "",
    discountedPrice: "",
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get("/category?page=1&limit=100"),
          api.get("/brand?page=1&limit=100"),
        ]);
        setCategories(catRes.data.data);
        setBrands(brandRes.data.data);
      } catch (err) {
        console.log(err);
        toast({
          title: "Error",
          description: "Failed to load categories or brands",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    };
    fetchData();
  }, [toast]);

  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    return (
      <Center h="100vh" >
        <p style={{ color: "red", fontSize: "20px" }}>
          🚫 You do not have permission to edit this ebook.
        </p>
      </Center>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Book name is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.discountedPrice)
      newErrors.discountedPrice = "Discounted price is required.";
    if (!formData.stock) newErrors.stock = "Stock is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.brand) newErrors.brand = "Brand is required.";
    if (!formData.images || formData.images.length === 0)
      newErrors.images = "Images are required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      data.append("discountedPrice", formData.discountedPrice);
      data.append("color", formData.color);
      data.append("size", formData.size);

      Array.from(formData.images).forEach((file) => {
        data.append("images", file);
      });

      await api.post("/product", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Success!",
        description: "Ebook added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
        images: null,
        color: "",
        size: "",
        discountedPrice: "",
      });
      setErrors({});
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      toast({
        title: "Error!",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center pb={{ base: "10", md: "12", sm: "14" }} mb="40px">
      <form onSubmit={handleSubmit}>
        <Stack
          spacing="2"
          w={["70%", "60%", "400px"]}
          mx="auto"
          p="4"
          m={10}
          borderWidth="1px"
          borderRadius="md"
          boxShadow="lg"
          bgRepeat="no-repeat"
          bgSize="cover"
          bgImage="url(https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688550.jpg?uid=R111967752&ga=GA1.1.617246776.1748393573&semt=ais_hybrid&w=740)"
        >
          <FormLabel>Product Name</FormLabel>
          <Input
            name="name"
            bg="white"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product name"
          />

          <FormLabel>Description</FormLabel>
          <Input
            name="description"
            bg="white"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            bg="white"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
          />

          <FormLabel>Discounted Price</FormLabel>
          <Input
            type="number"
            bg="white"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleChange}
            placeholder="Discounted Price"
          />

          <FormLabel>Stock</FormLabel>
          <Input
            type="number"
            bg="white"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
          />

          <FormLabel>Category</FormLabel>
          <Select
            name="category"
            bg="white"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option value={cat._id} key={cat._id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <FormLabel>Brand</FormLabel>
          <Select
            name="brand"
            bg="white"
            value={formData.brand}
            onChange={handleChange}
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option value={brand._id} key={brand._id}>
                {brand.name}
              </option>
            ))}
          </Select>

          <FormLabel>Upload Images</FormLabel>
          <FileUploadPreview
            onFilesChange={(files) => {
              setFormData({ ...formData, images: files });
              setErrors({ ...errors, images: "" });
            }}
          />

          {errors.images && <p style={{ color: "red" }}>{errors.images}</p>}

          <Button type="submit" colorScheme="blue">
            Submit
          </Button>
        </Stack>
      </form>
    </Center>
  );
}

export default EbookForm;
