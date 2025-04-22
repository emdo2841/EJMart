import React, { useState } from "react";
import { useToast, Box, Text, Image, VStack } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

const FileUploadPreview = ({ setImage }) => {
  const [preview, setPreview] = useState(null);
  const toast = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
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

      const file = acceptedFiles[0];
      if (file) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    },
  });

  return (
    <Box
      size="sm"
      {...getRootProps()}
      border="2px solid"
      borderColor="gray.300"
      borderRadius="lg"
      p={2} // Reduce padding
      textAlign="center"
      cursor="pointer"
      _hover={{ borderColor: "blue.300", bg: "gray.50" }}
      transition="all 0.2s"
    >
      <input {...getInputProps()} />
      <VStack spacing={3}>
        <Text fontSize="md" color="gray.600">
          Upload Image(jpeg/png)
        </Text>
        {preview && (
          <Image
            src={preview}
            alt="Preview"
            boxSize="50px"
            objectFit="cover"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
          />
        )}
      </VStack>
    </Box>
  );
};

export default FileUploadPreview;
