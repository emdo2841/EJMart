// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Center,
//   Input,
//   Button,
//   FormLabel,
//   Select,
//   Image,
//   Checkbox,
//   SimpleGrid,
//   Spinner,
//   useToast,
//   useColorModeValue,
//   Stack,
// } from "@chakra-ui/react";
// import { useForm } from "react-hook-form";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../src/context/api";

// const UpdateProduct = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const { register, handleSubmit, reset } = useForm();
//   const toast = useToast();

//   const bg = useColorModeValue("white", "gray.700");
//   const border = useColorModeValue("gray.200", "gray.600");

//   const [product, setProduct] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [imagesToRemove, setImagesToRemove] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [prodRes, catRes, brandRes] = await Promise.all([
//           api.get(`/product/${productId}`),
//           api.get("/category?page=1&limit=100"),
//           api.get("/brand?page=1&limit=100"),
//         ]);
//         const product = prodRes.data;

//         reset({
//           ...product,
//           category: product.category?._id,
//           brand: product.brand?._id,
//         });

//         setProduct(product);
//         setSelectedImages(product.images || []);
//         setCategories(catRes.data.data);
//         setBrands(brandRes.data.data);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to load product or supporting data.",
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//         });
//       }
//     };

//     fetchInitialData();
//   }, [productId, reset, toast]);

//   const toggleImageRemoval = (imgUrl) => {
//     setImagesToRemove((prev) =>
//       prev.includes(imgUrl)
//         ? prev.filter((i) => i !== imgUrl)
//         : [...prev, imgUrl]
//     );
//   };

//   const onSubmit = async (formData) => {
//     const data = new FormData();
//     for (const [key, value] of Object.entries(formData)) {
//       if (key !== "images") {
//         data.append(key, value);
//       }
//     }

//     if (formData.images && formData.images.length > 0) {
//       for (const file of formData.images) {
//         data.append("images", file);
//       }
//     }

//     if (imagesToRemove.length > 0) {
//       for (const url of imagesToRemove) {
//         data.append("imagesToRemove", url);
//       }
//     }

//     setIsSubmitting(true);
//     try {
//       const res = await api.put(`/product/${productId}`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });

//       toast({
//         title: "Success!",
//         description: "Product updated successfully.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });

//       setProduct(res.data.data);
//       setImagesToRemove([]);
//       navigate(`/product/${productId}`);
//     } catch (error) {
//       toast({
//         title: "Update failed",
//         description: error.response?.data?.details || error.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!product) return <Center mt={10}><Spinner size="xl" /></Center>;

//   return (
//     <Center>
//       <Box
//         as="form"
//         onSubmit={handleSubmit(onSubmit)}
//         p="6"
//         mt={10}
//         w={["70%", "60%", "400px"]}
//         borderWidth="1px"
//         borderRadius="md"
//         boxShadow="lg"
//         bg={bg}
//         borderColor={border}
//       >
//         <Stack spacing={4}>
//           <FormLabel>Name</FormLabel>
//           <Input {...register("name")} placeholder="Product Name" />

//           <FormLabel>Description</FormLabel>
//           <Input {...register("description")} placeholder="Description" />

//           <FormLabel>Price</FormLabel>
//           <Input type="number" step="0.01" {...register("price")} />

//           <FormLabel>Discounted Price</FormLabel>
//           <Input type="number" step="0.01" {...register("discountedPrice")} />

//           <FormLabel>Stock</FormLabel>
//           <Input type="number" {...register("stock")} />

//           <FormLabel>Color</FormLabel>
//           <Input {...register("color")} placeholder="Color (optional)" />

//           <FormLabel>Size</FormLabel>
//           <Input {...register("size")} placeholder="Size (optional)" />

//           <FormLabel>Category</FormLabel>
//           <Select {...register("category")}>
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option value={cat._id} key={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//           </Select>

//           <FormLabel>Brand</FormLabel>
//           <Select {...register("brand")}>
//             <option value="">Select Brand</option>
//             {brands.map((brand) => (
//               <option value={brand._id} key={brand._id}>
//                 {brand.name}
//               </option>
//             ))}
//           </Select>

//           <FormLabel>Upload New Images</FormLabel>
//           <Input type="file" multiple {...register("images")} />

//           <FormLabel>Current Images (click to mark for deletion)</FormLabel>
//           <SimpleGrid columns={[2, 3]} spacing={2}>
//             {selectedImages.map((img) => (
//               <Box key={img} textAlign="center">
//                 <Image
//                   src={img}
//                   alt="product"
//                   border={imagesToRemove.includes(img) ? "2px solid red" : "1px solid gray"}
//                   borderRadius="md"
//                   cursor="pointer"
//                   onClick={() => toggleImageRemoval(img)}
//                 />
//                 <Checkbox
//                   mt={1}
//                   isChecked={imagesToRemove.includes(img)}
//                   onChange={() => toggleImageRemoval(img)}
//                 >
//                   Remove
//                 </Checkbox>
//               </Box>
//             ))}
//           </SimpleGrid>

//           <Button
//             type="submit"
//             colorScheme="green"
//             isLoading={isSubmitting}
//           >
//             Submit
//           </Button>
//         </Stack>
//       </Box>
//     </Center>
//   );
// };

// export default UpdateProduct;
import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Input,
  Button,
  FormLabel,
  Select,
  Image,
  Checkbox,
  SimpleGrid,
  Spinner,
  useToast,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import api from "../src/context/api";
import FileUploadPreview from "./utilities/FileUploadPreview"; // adjust the path if needed


const UpdateProduct = () => { 
  const { productId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [newImage, setNewImage] = useState(null);
  const toast = useToast();

  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [prodRes, catRes, brandRes] = await Promise.all([
          api.get(`/product/${productId}`),
          api.get("/category?page=1&limit=100"),
          api.get("/brand?page=1&limit=100"),
        ]);
        const product = prodRes.data;

        reset({
          ...product,
          category: product.category?._id,
          brand: product.brand?._id,
        });

        setProduct(product);
        setSelectedImages(product.images || []);
        setCategories(catRes.data.data);
        setBrands(brandRes.data.data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load product or supporting data.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchInitialData();
  }, [productId, reset, toast]);

  const toggleImageRemoval = (imgUrl) => {
    setImagesToRemove((prev) =>
      prev.includes(imgUrl)
        ? prev.filter((i) => i !== imgUrl)
        : [...prev, imgUrl]
    );
  };

  const onSubmit = async (formData) => {
    const data = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (key !== "images") {
        data.append(key, value);
      }
    }

    if (newImage) {
      data.append("images", newImage);
    }


    if (imagesToRemove.length > 0) {
      for (const url of imagesToRemove) {
        data.append("imagesToRemove", url);
      }
    }

    setIsSubmitting(true);
    try {
      const res = await api.put(`/product/${productId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // ✅ Force image state update from server response
      const updatedProduct = res.data.data;
      console.log("Updated product:", updatedProduct);

      toast({
        title: "Success!",
        description: "Product updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setProduct(updatedProduct);
      setSelectedImages(updatedProduct.images || []); // ✅ Update selected images
      setImagesToRemove([]);
      navigate(`/product/${productId}`);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.response?.data?.details || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product)
    return (
      <Center mt={10}>
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Center>
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        p="6"
        mt={10}
        w={["90%", "70%", "500px"]}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="lg"
        bg={bg}
        borderColor={border}
      >
        <Stack spacing={2 }>
          <FormLabel>Name</FormLabel>
          <Input {...register("name")} placeholder="Product Name" />

          <FormLabel>Description</FormLabel>
          <Input {...register("description")} placeholder="Description" />

          <FormLabel>Price</FormLabel>
          <Input type="number" step="0.01" {...register("price")} />

          <FormLabel>Discounted Price</FormLabel>
          <Input type="number" step="0.01" {...register("discountedPrice")} />

          <FormLabel>Stock</FormLabel>
          <Input type="number" {...register("stock")} />

          <FormLabel>Color</FormLabel>
          <Input {...register("color")} placeholder="Color (optional)" />

          <FormLabel>Size</FormLabel>
          <Input {...register("size")} placeholder="Size (optional)" />

          <FormLabel>Category</FormLabel>
          <Select {...register("category")}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option value={cat._id} key={cat._id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <FormLabel>Brand</FormLabel>
          <Select {...register("brand")}>
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option value={brand._id} key={brand._id}>
                {brand.name}
              </option>
            ))}
          </Select>

          

          <FormLabel>Upload New Image</FormLabel>
          <FileUploadPreview setImage={setNewImage} />

          <FormLabel>Current Images (click to mark for deletion)</FormLabel>
          <SimpleGrid columns={[2, 3]} spacing={2}>
            {selectedImages.map((img) => (
              <Box key={img} textAlign="center">
                <Image
                  src={img}
                  alt="product"
                  border={
                    imagesToRemove.includes(img)
                      ? "2px solid red"
                      : "1px solid gray"
                  }
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => toggleImageRemoval(img)}
                  boxSize="100px"
                  objectFit="cover"
                />
                <Checkbox
                  mt={1}
                  isChecked={imagesToRemove.includes(img)}
                  onChange={() => toggleImageRemoval(img)}
                >
                  Remove
                </Checkbox>
              </Box>
            ))}
          </SimpleGrid>

          <Button type="submit" colorScheme="green" isLoading={isSubmitting}>
            Submit
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default UpdateProduct;
