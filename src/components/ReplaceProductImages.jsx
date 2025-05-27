// components/ReplaceProductImage.jsx
import {
  Box,
  Button,
  Center,
  FormLabel,
  Stack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../context/api";
import FileUploadPreview from "../utilities/FileUploadPreview";

const ReplaceProductImage = () => {
  const { productId } = useParams();
  const [images, setImages] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");

  const handleUpload = async () => {
    setLoading(true);
    if (!images.length)
      return toast({ title: "No images selected", status: "warning" });

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    try {
      await api.put(`/product/${productId}/add-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({ title: "Images added", status: "success", duration: 3000 });
      navigate(`/product/${productId}`);
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err.response?.data?.details || err.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center>
      <Box
        p={6}
        mt={10}
        w={["90%", "70%", "500px"]}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="lg"
        bg={bg}
        borderColor={border}
      >
        <Stack spacing={4}>
          <FormLabel>Upload Image</FormLabel>
          <FileUploadPreview setImage={setImages} />
          <Button colorScheme="blue" onClick={handleUpload} isLoading={loading}>
            Upload
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default ReplaceProductImage;
