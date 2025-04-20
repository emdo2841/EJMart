import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Center,
  Spinner,
  Text,
  VStack,
  Badge,
  Button,
} from "@chakra-ui/react";
import api from "./context/api"; // your axios instance
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile", {
          withCredentials: true,
        });
        setUser(res.data.user); // Assuming `res.data.user` holds the profile
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );

  if (error)
    return (
      <Center h="100vh">
        <Text color="red.500">Error: {error}</Text>
      </Center>
    );

  return (
    <Center py={10}>
      <Box
        maxW="sm"
        w="full"
        p={6}
        bg="white"
        boxShadow="xl"
        rounded="lg"
        textAlign="center"
      >
        <Avatar
          size="2xl"
          src={user.image || "https://bit.ly/broken-link"}
          name={user.fullName || "User"}
          mb={4}
        />
        <VStack spacing={1}>
          <Text fontSize="2xl" fontWeight="bold">
            {user.fullName}
          </Text>
          <Text fontSize="md" color="gray.500">
            {user.email}
          </Text>
          <Badge colorScheme={user.role === "admin" ? "purple" : "blue"}>
            {user.role}
          </Badge>
        </VStack>

        <Button
          mt={6}
          colorScheme="teal"
          size="sm"
          onClick={() => navigate(`/update-role/${user._id}`)}
        >
          Edit Profile
        </Button>
      </Box>
    </Center>
  );
};

export default Profile;
