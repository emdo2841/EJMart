import React, { useState } from "react";
import {
  useToast,
  Box,
  Text,
  Image,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

const FileUploadPreview = ({ setImages }) => {
  const [previews, setPreviews] = useState([]);
  const toast = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ errors }) => {
          errors.forEach((e) => {
            toast({
              title: "File upload error",
              description: e.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
        });
        return;
      }

      const newPreviews = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setPreviews(newPreviews);
      setImages(acceptedFiles); // Update the parent component's images state
    },
  });

  return (
    <Box
      {...getRootProps()}
      border="2px dashed"
      borderColor="gray.300"
      borderRadius="lg"
      p={4}
      textAlign="center"
      cursor="pointer"
      _hover={{ borderColor: "blue.300", bg: "gray.50" }}
      transition="all 0.2s"
    >
      <input {...getInputProps()} />
      <VStack spacing={3}>
        <Text fontSize="md" color="gray.600">
          Upload Or drag Images (jpg/jpeg/png)
        </Text>
        <SimpleGrid columns={[2, 3]} spacing={2}>
          {previews.map(({ preview }, idx) => (
            <Image
              key={idx}
              src={preview}
              alt={`Preview ${idx}`}
              boxSize="60px"
              objectFit="cover"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            />
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default FileUploadPreview;
