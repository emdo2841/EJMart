import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/authContext";
import { Button, useToast, Spinner, Text, Center } from "@chakra-ui/react";
import api from "./context/api";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      // Send refresh token in request body (as expected by your backend)
      await api.post(
        "/auth/logout",
        { refreshToken },
        { withCredentials: true }
      );

      // Clear client-side auth state
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      setUser(null);

      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description:
          error.response?.data?.message || "Something went wrong during logout",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center flexDirection="column" mt="10">
      <Text fontSize="xl" mb="4">
        Are you sure you want to logout?
      </Text>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <Button colorScheme="red" onClick={handleLogout} size="lg">
          Logout
        </Button>
      )}
    </Center>
  );
};

export default Logout;
