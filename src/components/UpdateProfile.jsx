import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Flex,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../context/api";
import FileUploadPreview from "../components/fileUploadPreview ";

const UpdateProfile = ({ userId }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    image: null,
  });
  const [error, setError] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInfo = async () => {
    const data = {};
    if (formData.fullName) data.fullName = formData.fullName;
    if (formData.address) data.address = formData.address;
    if (formData.phone) data.phone = formData.phone;

    if (Object.keys(data).length === 0) {
      toast({ title: "No changes detected.", status: "warning" });
      return;
    }

    try {
      const res = await api.put(`/users/update-info/${userId}`, data, {
        withCredentials: true,
      });
      toast({
        title: "Info updated!",
        description: res.data.message,
        status: "success",
      });
      setError({});
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Update failed.";
      setError({ form: message });
    }
  };

  const handleUpdateImage = async () => {
    if (!formData.image) {
      toast({ title: "No image selected.", status: "warning" });
      return;
    }

    const data = new FormData();
    data.append("image", formData.image);

    try {
      const res = await api.put(`/users/update-image/${userId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast({
        title: "Image updated!",
        description: res.data.message,
        status: "success",
      });
      setError({});
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Image update failed.";
      setError({ form: message });
    }
  };

  return (
    <Flex minHeight="80vh" justify="center" align="center">
      <Box
        w={["90%", "70%", "400px"]}
        mx="auto"
        p={6}
        boxShadow="md"
        borderRadius="md"
        bg="gray.50"
      >
        <Heading mb={4} textAlign="center" size="md">
          Update Profile
        </Heading>

        {error.form && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error.form}
          </Alert>
        )}

        <VStack spacing={4}>
          {/* Update Info Fields */}
          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              size="sm"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              size="sm"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              size="sm"
            />
          </FormControl>

          <Button colorScheme="blue" width="full" onClick={handleUpdateInfo}>
            Update Info
          </Button>

          {/* Upload Image */}
          <FormControl>
            <FormLabel>Profile Picture</FormLabel>
            <FileUploadPreview
              setImage={(img) =>
                setFormData((prev) => ({ ...prev, image: img }))
              }
            />
          </FormControl>

          <Button colorScheme="teal" width="full" onClick={handleUpdateImage}>
            Update Image
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default UpdateProfile;

// const handleUpdateInfo = async () => {
//   const data = {};
//   if (formData.fullName) data.fullName = formData.fullName;
//   if (formData.address) data.address = formData.address;
//   if (formData.phone) data.phone = formData.phone;

//   if (Object.keys(data).length === 0) {
//     toast({ title: "No changes detected.", status: "warning" });
//     return;
//   }

//   try {
//     const res = await api.put(`/users/update-info/${userId}`, data, { withCredentials: true });
//     toast({ title: "Profile updated!", description: res.data.message, status: "success" });
//   } catch (err) {
//     console.error(err);
//     toast({ title: "Error", description: err.response?.data?.message, status: "error" });
//   }
// };
