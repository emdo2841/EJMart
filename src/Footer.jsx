// Footer.js
import {
  Flex,
  Text,
  Link as ChakraLink,
  Icon,
  Center,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { startTransition } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { useAuth } from "./context/authContext";

const Footer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
    const hideLogin = location.pathname.startsWith("/login");
    const hideSignup = location.pathname.startsWith("/signup");
  return (
    <Flex
      as="footer"
      position="fixed"
      bottom="0"
      width="100%"
      zIndex="1000"
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align="center"
      p="4"
      bg="gray.100"
      color="gray.600"
      _dark={{ bg: "gray.700", color: "gray.300" }}
      mt="8"
    >
      <Flex align="center" gap="4" mb={{ base: 4, md: 0 }}>
        <ChakraLink as={Link} to="/" _hover={{ textDecoration: "underline" }}>
          <Flex align="center" gap="1">
            <Icon as={FaHome} />
            <Text>Home</Text>
          </Flex>
        </ChakraLink>
        {}
        {!user && !hideLogin && (
          <Button
            as={Link}
            to="/login"
            size="xs"
            leftIcon={<FaSignInAlt />}
            variant="outline"
            _hover={{
              transform: "scale(1.02)",
              textDecoration: "underline",
              color: "teal.700",
            }}
          >
             Login
          </Button>
        )}
        {!user && !hideSignup && (
          <Button
            as={Link}
            to="/signup"
            size="xs"
            leftIcon={<FaUserPlus color="red.300" />}
            variant="outline"
            _hover={{
              transform: "scale(1.02)",
              textDecoration: "none",
              color: ".700",
            }}
          >
            Sign Up
          </Button>
        )}

        {user && (
          <ChakraLink
            as="button" // <<< change
            onClick={() => startTransition(() => navigate("/profile"))} // <<< change
            _hover={{
              transform: "scale(1.02)",
              textDecoration: "non",
              color: "teal.700",
            }}
          >
            <Flex align="center" gap="1">
              <Icon as={FaUser} color="red:300" />
              <Text>Profile</Text>
            </Flex>
          </ChakraLink>
        )}
      </Flex>

      {user ? (
        <Button
          as={Link}
          to="/logout"
          size="xs"
          color="red.300"
          leftIcon={<FaSignOutAlt />}
          variant="outline"
          _hover={{
            transform: "scale(1.02)",
            textDecoration: "underline",
            color: "red.700",
          }}
        >
          {" "}
          Logout
        </Button>
      ) : (
        <Center>
          <Text fontSize="sm">
            © {new Date().getFullYear()} EJ Mart. All rights reserved.
          </Text>
        </Center>
      )}
    </Flex>
  );
};

export default Footer;
