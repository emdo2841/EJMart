
import api from "../context/api";
import { useState, useEffect, useRef } from "react";
import {
  Flex,
  Box,
  Button,
  Center,
  CircularProgress,
  Text,
  Badge,
  useToast,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const GetAllUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
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

        const filteredUsers = response.data.users.filter(
          (u) => u._id !== user._id
        );
        setUsers(filteredUsers);
        setTotalUsers(response.data.total || 0);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
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

      setUsers((prev) => prev.filter((u) => u._id !== selectedUserId));
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
      <Center flexDirection="column" p={4} minH="80vh">
        <CircularProgress isIndeterminate color="blue.400" size="80px" />
        
      </Center>
    );
  }

  if (error)
    return (
      <Center flexDirection="column" p={4} minH="100vh">
        <Text fontSize="lg" color="red.500" mb={4}>
        Error: {error} please try again</Text>
      </Center>
    );

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <Flex direction="column" align="center" p={4} minH="100vh">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Users
      </Text>

      {users.length > 0 ? (
        <Flex wrap="wrap" justify="center" gap={6}>
          {users.map((user) => (
            <Box
              key={user._id}
              p={4}
              w="250px"
              borderWidth="1px"
              borderColor="gray.300"
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              {user.image && (
                <Image
                  src={user.image}
                  alt={`${user.fullName}'s profile`}
                  borderRadius="full"
                  boxSize="100px"
                  objectFit="cover"
                  mb={4}
                  mx="auto"
                />
              )}
              <Text fontWeight="semibold" mb={1}>
                 {user.fullName}
              </Text>
              <Text fontSize="sm" color="gray.600" noOfLines={1}>
               {user.email}
              </Text>
              <Badge fontSize="sm" color="gray.600" mb={3}>
                {user.role}
              </Badge>

              <Flex gap={2} justify="center" mt={2}>
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={() => navigate(`/user/${user._id}`)}
                >
                  View
                </Button>

                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setSelectedUserId(user._id);
                    setIsDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </Flex>
            </Box>
          ))}
        </Flex>
      ) : (
        <Text>No users found</Text>
      )}

      {/* Pagination Controls */}
      <Flex mt={8} gap={4} align="center">
        <Button
          onClick={() => setPage((prev) => prev - 1)}
          isDisabled={page === 1}
        >
          Previous
        </Button>
        <Text>
          Page {page} of {totalPages}
        </Text>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          isDisabled={page >= totalPages}
        >
          {page >= totalPages ? "Last" : "Next"}
        </Button>
      </Flex>

      {/* Delete Confirmation Dialog */}
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
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default GetAllUsers;
