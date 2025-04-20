import api from "./context/api";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  List,
  ListItem,
  CircularProgress,
  Text,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { useRef } from "react";

const GetAllUsers = () => {
  const { user } = useAuth(); // Get logged-in user
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [limit] = useState(21); // Number of products per page
  const [totalUsers, setTotalUsers] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const cancelRef = useRef();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get(
          `/auth/users?page=${page}&limit=${limit}`,
          {
            withCredentials: true,
          }
        );

        // 🔥 Filter out the logged-in user
        const filteredUsers = response.data.users.filter(
          (u) => u._id !== user._id
        );
        setUsers(filteredUsers);
        setTotalUsers(response.data.total || 0);
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data?.message || error.message
          : error.message;

        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit, user, toast]);

  const handleDelete = async () => {
    try {
      await api.delete(`/auth/user/${selectedUserId}`, {
        withCredentials: true,
      });

      setUsers(users.filter((u) => u._id !== selectedUserId));
      setIsDialogOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.response?.data?.message || "Failed to delete user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center flexDirection="column" p={4}>
        <CircularProgress isIndeterminate color="green.400" size="80px" />
        <Text mt={4} fontSize="lg" color="gray.600">
          Loading...
        </Text>
      </Center>
    );
  }

  if (error) return <p>Error: {error}</p>;

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalUsers / limit);
  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <Center>
      <div>
        <Center>
          <Text fontSize="2xl" fontWeight="bold">
            Users
          </Text>
        </Center>
        {users.length > 0 ? (
          <List>
            {users.map((user) => {
              // Convert binary data to Base64 if user.file exists
              let imageUrl = "";
              if (user.file && user.file.data) {
                try {
                  const base64String = btoa(
                    new Uint8Array(user.file.data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ""
                    )
                  );
                  imageUrl = `data:${user.file.mimetype};base64,${base64String}`;
                } catch (error) {
                  console.error("Error converting image data:", error);
                }
              }

              return (
                <Box
                  p="4"
                  borderWidth="1px"
                  borderColor="gray.300"
                  key={user._id}
                  borderRadius="md"
                  boxShadow="sm"
                  mb="4"
                >
                  <ListItem>
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={`${user.fullName}'s profile`}
                        borderRadius="full"
                        boxSize="100px"
                        objectFit="cover"
                        mb="2"
                      />
                    )}
                    <h3>Name: {user.fullName}</h3>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <Button
                      colorScheme="green"
                      onClick={() => handleUserClick(user._id)}
                      color="white"
                      _hover={{ bg: "green.600" }}
                      variant="solid"
                      size="md"
                    >
                      View User
                    </Button>

                    <Button
                      colorScheme="red"
                      onClick={() => {
                        setSelectedUserId(user._id);
                        setIsDialogOpen(true);
                      }}
                      color="white"
                      _hover={{ bg: "red.600" }}
                      variant="solid"
                      size="md"
                      ml="2"
                    >
                      Delete User
                    </Button>
                  </ListItem>
                  <AlertDialog
                    isOpen={isDialogOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={() => setIsDialogOpen(false)}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Delete User
                        </AlertDialogHeader>

                        <AlertDialogBody>
                          Are you sure you want to delete this user? This action
                          cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button
                            ref={cancelRef}
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={handleDelete}
                            ml={3}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </Box>
              );
            })}
          </List>
        ) : (
          <p>No users found</p>
        )}
      </div>
      {/* Pagination Controls */}
      <Box
        mt="4"
        display="flex"
        flexDirection={{ base: "column", sm: "row" }}
        alignItems="center"
        justifyContent="center"
        gap="2"
      >
        <Button
          isDisabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          width={{ base: "100%", sm: "auto" }}
        >
          Previous
        </Button>

        <Text fontSize="sm" mx="2">
          Page {page} of {totalPages}
        </Text>

        <Button
          onClick={() => setPage((prev) => prev + 1)}
          isDisabled={page >= totalPages}
          width={{ base: "100%", sm: "auto" }}
        >
          {page >= totalPages ? "Last" : "Next"}
        </Button>
      </Box>
    </Center>
  );
};

export default GetAllUsers;
