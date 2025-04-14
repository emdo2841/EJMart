import { useEffect, useState } from "react";
import api from "./context/api";
import { Box, Center, Text, CircularProgress, Button, useToast, Image} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./context/authContext";

const UserDetails = () => {
  const [userData, setUserData] = useState(null); // Storing a single user, not an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await api.get(
          `/auth/user/${userId}`,
          {
            withCredentials: true,
          }
        );

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

  if (error) {
    return (
      <Center>
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  if (!userData) {
    return (
      <Center>
        <Text>No user found.</Text>
      </Center>
    );
  }

  return (
    <Box maxW="700px" w="100%" mx="auto" p="4">
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
    </Box>
  );
};

export default UserDetails;
