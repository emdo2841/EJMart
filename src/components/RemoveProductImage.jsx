// components/RemoveProductImages.jsx
import {
  Box,
  Button,
  Center,
  Checkbox,
  FormLabel,
  Image,
  SimpleGrid,
  Stack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../context/api";

const RemoveProductImages = () => {
  const { productId } = useParams();
  const [images, setImages] = useState([]);
  const [toRemove, setToRemove] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchImages = async () => {
      const res = await api.get(`/product/${productId}`);
      console.log(res)
      setImages(res.data.data.images || []);
    };
    fetchImages();
  }, [productId]);

  const toggleRemove = (imgUrl) => {
    setToRemove((prev) =>
      prev.includes(imgUrl)
        ? prev.filter((url) => url !== imgUrl)
        : [...prev, imgUrl]
    );
  };

  const handleRemove = async () => {
    try {
      await api.post(`/product/${productId}/remove-images`, {
        imagesToRemove: toRemove,
      });
      toast({ title: "Images removed", status: "success", duration: 3000 });
      navigate(`/product/${productId}`);
    } catch (err) {
      console.log(err);
      toast({
        title: "Removal failed",
        description: err.response?.data?.details || err.message,
        status: "error",
        duration: 5000,
      });
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
          <FormLabel>Select images to remove</FormLabel>
          <SimpleGrid columns={[2, 3]} spacing={2}>
            {images.map((img) => (
              <Box key={img} textAlign="center">
                <Image
                  src={img}
                  alt="product"
                  border={
                    toRemove.includes(img) ? "2px solid red" : "1px solid gray"
                  }
                  borderRadius="md"
                  boxSize="100px"
                  objectFit="cover"
                  onClick={() => toggleRemove(img)}
                  cursor="pointer"
                />
                <Checkbox
                  mt={1}
                  isChecked={toRemove.includes(img)}
                  onChange={() => toggleRemove(img)}
                >
                  Remove
                </Checkbox>
              </Box>
            ))}
          </SimpleGrid>
          <Button colorScheme="red" onClick={handleRemove}>
            Remove Selected
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default RemoveProductImages;
    