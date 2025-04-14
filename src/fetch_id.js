// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Center,
//   Image,
//   Spinner,
//   Text,
//   HStack,
//   VStack,
// } from "@chakra-ui/react";
// import api from "./context/api";

// const ProductDetails = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProductById = async () => {
//       try {
//         const response = await api.get(`/product/${id}`);
//         const productData = response.data.data;
//         setProduct(productData);
//         setSelectedImage(productData.images?.[0] || null); // Set first image as default
//       } catch (err) {
//         setError(err.response?.data?.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductById();
//   }, [id]);

//   if (loading) {
//     return (
//       <Center h="100vh">
//         <Spinner size="xl" />
//       </Center>
//     );
//   }

//   if (error) {
//     return (
//       <Center h="100vh">
//         <Text color="red.500">Error: {error}</Text>
//       </Center>
//     );
//   }

//   if (!product) {
//     return (
//       <Center h="100vh">
//         <Text>Product not found</Text>
//       </Center>
//     );
//   }

//   return (
//     <Center py="10">
//       <Box
//         maxW="lg"
//         borderWidth="1px"
//         borderRadius="lg"
//         overflow="hidden"
//         p={4}
//         boxShadow="md"
//         width="100%"
//       >
//         <VStack spacing={4}>
//           {/* Main Image */}
//           <Image
//             src={selectedImage}
//             alt={product.name}
//             mx="auto"
//             boxSize="300px"
//             objectFit="cover"
//             borderRadius="md"
//             border="1px solid #ccc"
//           />

//           {/* Thumbnails if multiple images exist */}
//           {product.images?.length > 1 && (
//             <>
//               <Text fontSize="sm" color="gray.500">
//                 Click to view more images
//               </Text>
//               <HStack spacing={2} flexWrap="wrap">
//                 {product.images.map((img, idx) => (
//                   <Image
//                     key={idx}
//                     src={img}
//                     boxSize="60px"
//                     objectFit="cover"
//                     borderRadius="md"
//                     border={
//                       img === selectedImage
//                         ? "2px solid green"
//                         : "1px solid #ccc"
//                     }
//                     cursor="pointer"
//                     onClick={() => setSelectedImage(img)}
//                     _hover={{ opacity: 0.8 }}
//                   />
//                 ))}
//               </HStack>
//             </>
//           )}

//           {/* Product Info */}
//           <Text fontSize="2xl" fontWeight="bold">
//             {product.name}
//           </Text>

//           <Text>
//             <Text as="span" color="gray.500" textDecoration="line-through">
//               NGN {product.price}
//             </Text>{" "}
//             <Text as="span" color="green.600" fontWeight="bold">
//               NGN {product.discountedPrice}
//             </Text>
//           </Text>

//           <Text fontSize="sm" color="red.500">
//             {product.discountPercentage?.toFixed(2)}% off
//           </Text>

//           <Text mt="2" fontSize="md">
//             {product.description || "No description provided."}
//           </Text>

//           <Button
//             mt="4"
//             colorScheme="blue"
//             onClick={() => window.history.back()}
//           >
//             Go Back
//           </Button>
//         </VStack>
//       </Box>
//     </Center>
//   );
// };

// export default ProductDetails;
import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Image,
  Spinner,
  Text,
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import api from "./context/api";
import { useCart } from "./context/CartContext";

const ProductDetails = () => {
   const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await api.get(`/product/${id}`);
        const productData = response.data.data;
        setProduct(productData);
        setSelectedImage(productData.images?.[0] || null);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [id]);

  const handleImageClick = (img) => {
  const index = product.images.indexOf(img);
  setCurrentImageIndex(index);
  setModalImage(img);
  onOpen();
};

  const handleNext = () => {
  const nextIndex = (currentImageIndex + 1) % product.images.length;
  setCurrentImageIndex(nextIndex);
  setModalImage(product.images[nextIndex]);
};

const handlePrev = () => {
  const prevIndex =
    (currentImageIndex - 1 + product.images.length) % product.images.length;
  setCurrentImageIndex(prevIndex);
  setModalImage(product.images[prevIndex]);
};


  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text color="red.500">Error: {error}</Text>
      </Center>
    );
  }

  if (!product) {
    return (
      <Center h="100vh">
        <Text>Product not found</Text>
      </Center>
    );
  }

  return (
    <Center py="10">
      <Box
        maxW="lg"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        boxShadow="md"
        width="100%"
      >
        <VStack spacing={4}>
          {/* Main Image with click to open modal */}
          <Image
            src={selectedImage}
            alt={product.name}
            mx="auto"
            boxSize="300px"
            objectFit="cover"
            borderRadius="md"
            border="1px solid #ccc"
            cursor="pointer"
            onClick={() => handleImageClick(selectedImage)}
          />

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <>
              <Text fontSize="sm" color="gray.500">
                Click an image to view in fullscreen
              </Text>
              <HStack spacing={2} flexWrap="wrap">
                {product.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    boxSize="60px"
                    objectFit="cover"
                    borderRadius="md"
                    border={
                      img === selectedImage
                        ? "2px solid green"
                        : "1px solid #ccc"
                    }
                    cursor="pointer"
                    onClick={() => {
                      setSelectedImage(img);
                      handleImageClick(img);
                    }}
                    _hover={{ opacity: 0.8 }}
                  />
                ))}
              </HStack>
            </>
          )}

          {/* Info */}
          <Text fontSize="2xl" fontWeight="bold">
            {product.name}
          </Text>

          <Text>
            <Text as="span" color="gray.500" textDecoration="line-through">
              NGN {product.price}
            </Text>{" "}
            <Text as="span" color="green.600" fontWeight="bold">
              NGN {product.discountedPrice}
            </Text>
          </Text>

          <Text fontSize="sm" color="red.500">
            {product.discountPercentage?.toFixed(2)}% off
          </Text>

          <Text mt="2" fontSize="md">
            {product.description || "No description provided."}
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
            mt="4"
            colorScheme="blue"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </VStack>
      </Box>

      {/* Modal Lightbox */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none" position="relative">
          <ModalCloseButton color="white" />

          {/* Left Arrow */}
          <Button
            position="absolute"
            left="0"
            top="50%"
            transform="translateY(-50%)"
            zIndex="1"
            onClick={handlePrev}
            bg="rgba(0,0,0,0.4)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.6)" }}
            size="sm"
            borderRadius="full"
          >
            &#8592;
          </Button>

          {/* Right Arrow */}
          <Button
            position="absolute"
            right="0"
            top="50%"
            transform="translateY(-50%)"
            zIndex="1"
            onClick={handleNext}
            bg="rgba(0,0,0,0.4)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.6)" }}
            size="sm"
            borderRadius="full"
          >
            &#8594;
          </Button>

          <ModalBody p={0}>
            <Image
              src={modalImage}
              alt="Preview"
              w="100%"
              h="auto"
              maxH="80vh"
              objectFit="contain"
              borderRadius="lg"
              mx="auto"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Center>
  );
};

export default ProductDetails;
