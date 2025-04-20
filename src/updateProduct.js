// import React, { useState } from "react";
// import {
//   Box,
//   FormControl,
//   FormLabel,
//   Input,
//   Textarea,
//   Button,
//   Alert,
//   AlertIcon,
//   Spinner,
//   useColorModeValue,
//   Center,
//   useToast
// } from "@chakra-ui/react";
// import api from "./context/api"; // Adjust the path to your Axios instance
// import {useAuth} from "./context/authContext"

// const AddReview = ({ productId, onSuccess }) => {
//   const [rating, setRating] = useState("");
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const cardBg = useColorModeValue("gray.50", "gray.800");
//   // const cardBorder = useColorModeValue("gray.200", "gray.600");
//   // const textColor = useColorModeValue("gray.700", "gray.200");
//   const toast = useToast();
//   const { user } = useAuth();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");

//     try {
//       const newReview = {
//         reviews: [
//           {
//             user: user.id,
//             rating: parseInt(rating, 10),
//             comment,
//           },
//         ],
//       };

//       const res = await api.post(`/product/${productId}/reviews`, newReview, {
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         toast({
//           title: "Success!",
//           description: "Review added successfully!",
//           status: "success",
//           duration: 5000,
//           isClosable: true,
//         });

//         setComment("");
//         setRating("");
//         if (onSuccess) onSuccess(); // <== Call this to trigger reload
//       }
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.message || "Failed to update the review."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       maxW="500px"
//       mx="auto"
//       p={6}
//       borderWidth="1px"
//       borderRadius="md"
//       boxShadow="lg"
//       bg={cardBg}
//     >
//       <form onSubmit={handleSubmit}>
//         <FormControl isRequired mb={4}>
//           <FormLabel>Rating (1-5)</FormLabel>
//           <Input
//             type="number"
//             min="1"
//             max="5"
//             value={rating}
//             onChange={(e) => setRating(e.target.value)}
//             placeholder="Enter rating"
//           />
//         </FormControl>

//         <FormControl mb={4}>
//           <FormLabel>Comment</FormLabel>
//           <Textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="How do you feel about the product"
//           />
//         </FormControl>

//         {loading ? (
//           <Center>
//             <Spinner size="lg" />
//           </Center>
//         ) : (
//           <Button type="submit" colorScheme="blue" width="full">
//             Add Review
//           </Button>
//         )}

//         {successMessage && (
//           <Alert status="success" mt={4}>
//             <AlertIcon />
//             {successMessage}
//           </Alert>
//         )}

//         {errorMessage && (
//           <Alert status="error" mt={4}>
//             <AlertIcon />
//             {errorMessage}
//           </Alert>
//         )}
//       </form>
//     </Box>
//   );
// };
 
// export default AddReview;

import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue,
  Center,
  useToast,
} from "@chakra-ui/react";
import api from "./context/api";
// import { useAuth } from "./context/authContext";

const AddReview = ({ productId, onSuccess }) => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const toast = useToast();
  // const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const reviewPayload = {
        rating: parseInt(rating, 10),
        comment,
      };

      const res = await api.post(
        `/product/${productId}/reviews`,
        reviewPayload,
        {
          withCredentials: true,
        }
      );

      toast({
        title: "Review Added",
        description: res.data.message || "Review submitted successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setComment("");
      setRating("");
      if (onSuccess) onSuccess(); // trigger refresh of product data
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to add review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW="500px"
      mx="auto"
      mt={8}
      p={6}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="lg"
      bg={cardBg}
    >
      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb={4}>
          <FormLabel>Rating (1–5)</FormLabel>
          <Input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Enter your rating"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Comment</FormLabel>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your thoughts about this product..."
          />
        </FormControl>

        {loading ? (
          <Center>
            <Spinner size="lg" />
          </Center>
        ) : (
          <Button
  type="submit"
  colorScheme="blue"
  width="full"
  isDisabled={!rating || rating < 1 || rating > 5 || loading}
>
  Submit Review
</Button>
        )}

        {errorMessage && (
          <Alert status="error" mt={4}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default AddReview;
