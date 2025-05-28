//  import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Box,
//   Button,
//   FormControl,
//   Input,
//   Heading,
//   Alert,
//   AlertIcon,
//   useToast,
//   Flex,
//   FormLabel,
//   VStack
// } from "@chakra-ui/react";
// import FileUploadPreview from "./fileUploadPreview";
// import api from "./context/api";

// const UpdateProfile = () => {
//   const toast = useToast();
//   const navigate = useNavigate();
//   const { userId } = useParams();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     address: "",
//     phone: "",
//     image: null,
//   });

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     if (!window.navigator.onLine) {
//       setError("No internet connection. Please check your network.");
//       setIsLoading(false);
//       return;
//     }

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value) data.append(key, value);
//     });

//     try {
//       const res = await api.put(`/auth/update-profile/${userId}`, data, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (res.data.success) {
//         toast({
//           title: "Success!",
//           description: res.data.message,
//           status: "success",
//           duration: 5000,
//           isClosable: true,
//         });
//         navigate("/profile");
//       } else {
//         throw new Error("Unexpected response");
//       }
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Update failed",
//         description:
//           err.response?.data?.message ||
//           "Something went wrong during update.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Flex minHeight="80vh" justify="center" align="center" bg="gray.50">
//       <Box
//         w={["90%", "70%", "400px"]}
//         p={6}
//         boxShadow="md"
//         borderRadius="md"
//         bg="white"
//       >
//         <Heading mb={4} textAlign="center" size="md">
//           Update Profile
//         </Heading>

//         {error && (
//           <Alert status="error" mb={4}>
//             <AlertIcon />
//             {error}
//           </Alert>
//         )}

//         <form onSubmit={handleSubmit}>
//           <VStack spacing={4}>
//             <FormControl isRequired>
//               <FormLabel>Full Name</FormLabel>
//               <Input
//                 name="fullName"
//                 placeholder="Enter full name"
//                 size="sm"
//                 value={formData.fullName}
//                 onChange={handleChange}
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Address</FormLabel>
//               <Input
//                 name="address"
//                 placeholder="Enter address"
//                 size="sm"
//                 value={formData.address}
//                 onChange={handleChange}
//               />
//             </FormControl>

//             <FormControl isRequired>
//               <FormLabel>Telephone</FormLabel>
//               <Input
//                 name="phone"
//                 placeholder="Enter phone number"
//                 type="tel"
//                 size="sm"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//             </FormControl>

//             <FormControl>
//               <FormLabel>Picture</FormLabel>
//               <FileUploadPreview
//                 setImage={(img) =>
//                   setFormData((prev) => ({ ...prev, image: img }))
//                 }
//               />
//             </FormControl>

//             <Button
//               type="submit"
//               colorScheme="blue"
//               width="full"
//               isLoading={isLoading}
//               loadingText="Updating"
//             >
//               Update Profile
//             </Button>
//           </VStack>
//         </form>
//       </Box>
//     </Flex>
//   );
// };

// export default UpdateProfile;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  Input,
  Heading,
  Alert,
  AlertIcon,
  useToast,
  Flex,
  FormLabel,
  VStack,
  Text,
  CircularProgress,
  Image,
  Center,
} from "@chakra-ui/react";
import FileUploadPreview from "./fileUploadPreview";
import api from "../context/api";

const UpdateProfile = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch existing user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/auth/user/${userId}`, {
          withCredentials: true,
        });
        const { fullName, address, phone, image } = res.data.user;
        setFormData({ fullName, address, phone, image: null });
        if (image) setPreviewUrl(image);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
        toast({
          title: "Error loading profile",
          description: err.response?.data?.message || "Could not fetch user",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
  }, [userId, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!window.navigator.onLine) {
      setError("No internet connection. Please check your network.");
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val) data.append(key, val);
    });

    try {
      const res = await api.put(`/auth/update-profile/${userId}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast({
          title: "Profile updated!",
          description: res.data.message,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/profile");
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {

      toast({
        title: "Update failed",
        description:
          err.response?.data?.message || "Something went wrong during update.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <Center flexDirection="column" p={4} minH="80vh">
            <CircularProgress isIndeterminate color="blue.400" size="80px" />
            </Center>
    );
  }
  if (error)
    return (
      <Center minH="80vh"><Text>{ error }</Text></Center>
    )
  return (
    <Flex
      minHeight="100vh"
      justify="center"
      align="center"
      bg="gray.50"
      pb="120px"
      pt="20px"
    >
      <Box
        w={["90%", "70%", "400px"]}
        p={6}
        boxShadow="md"
        borderRadius="md"
        bg="white"
        bgRepeat="no-repeat"
        bgSize="cover"
        bgImage="url(https://img.freepik.com/free-photo/cyber-monday-shopping-sales_23-2148688550.jpg?uid=R111967752&ga=GA1.1.617246776.1748393573&semt=ais_hybrid&w=740)"
      >
        <Heading mb={4} textAlign="center" size="md">
          Update Profile
        </Heading>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            {/* Current Picture Preview */}
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Current profile"
                boxSize="100px"
                borderRadius="full"
                objectFit="cover"
                mb={2}
                mx="auto"
              />
            )}

            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="fullName"
                placeholder="Enter full name"
                size="sm"
                bg="white"
                value={formData.fullName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                placeholder="Enter address"
                size="sm"
                bg="white"
                value={formData.address}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Telephone</FormLabel>
              <Input
                name="phone"
                placeholder="Enter phone number"
                type="tel"
                size="sm"
                bg="white"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Change Picture</FormLabel>
              <FileUploadPreview
                setImage={(img) => {
                  setFormData((prev) => ({ ...prev, image: img }));
                  setPreviewUrl(URL.createObjectURL(img));
                }}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isSubmitting}
              loadingText="Updating"
            >
              Update Profile
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default UpdateProfile;
