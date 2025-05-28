import { useEffect, useState } from "react";
import api from "../context/api";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Center,
  Text,
  CircularProgress,
  Button,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useRef } from "react";

const UserDetails = () => {
  const [userData, setUserData] = useState(null); // Storing a single user, not an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const cancelRef = useRef();

  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const { userId } = useParams();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setError("Access denied. Admins only.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get(`/auth/user/${userId}`, {
          withCredentials: true,
        });

        if (response.data && response.data.user) {
          setUserData(response.data.user);
        } else {
          setError("User not found.");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Error fetching user:", errorMessage);
        setError(errorMessage);

        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, userId, toast]);

  const handleDelete = async () => {
    try {
      await api.delete(`/auth/user/${selectedUserId}`, {
        withCredentials: true,
      });

      setUserData(userData.filter((u) => u._id !== selectedUserId));
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
      <Center flexDirection="column" p={4} minH="100vh">
        <CircularProgress isIndeterminate color="blue.400" size="80px" />
        
      </Center>
    );
  }

  if (error) {
    return (
      <Center flexDirection="column" p={4} minH="100vh">
        <Text fontSize="lg" color="red.500">
          {error}
        </Text>
      </Center>
    );
  }

  if (!userData) {
    return (
      <Center flexDirection="column" p={4} minH="100vh">
        <Text>No user found.</Text>
      </Center>
    );
  }

  return (
    <Box maxW="700px" w="100%" mx="auto" p="4" minH="100vh">
      <Text fontSize="2xl" fontWeight="bold">
        {userData.fullName}
      </Text>

      <Box mt="4" p="4" borderWidth="1px" borderRadius="md">
        <Image
          src={userData.image}
          alt={userData.fullName}
          mx="auto"
          boxSize="300px"
          objectFit="cover"
          borderRadius="md"
          border="1px solid #ccc"
        />
        <Text>
          <strong>Email:</strong> {userData.email}
        </Text>
        <Text>
          <strong>Role:</strong> {userData.role}
        </Text>

        <Button
          colorScheme="teal"
          onClick={() => navigate(`/update-role/${userData._id}`)}
          mt="4"
        >
          Update
        </Button>

        <Button
          colorScheme="red"
          onClick={() => navigate(`/delete-user/${userData._id}`)}
          mt="4"
          ml="2"
        >
          Delete
        </Button>
      </Box>
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
    </Box>
  );
};

export default UserDetails;
