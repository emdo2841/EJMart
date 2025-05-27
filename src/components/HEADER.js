import { useNavigate, useLocation} from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  useDisclosure,
//   useBreakpointValue,
  Container,
  Badge,
} from '@chakra-ui/react';
import { Menu, User, Heart } from 'lucide-react';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import BrandDropdown from "./BrandDropdown"
import CategoryDropdown from "./CategoryDrpdown"
import CartCount from "../utilities/cartCount";
import { useAuth } from "../context/authContext"
import { startTransition } from 'react';

const Header = () => {
    const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate()
  const { user } = useAuth();
  const location = useLocation();
    
      const hideLogin = location.pathname.startsWith("/login");
      const hideSignup = location.pathname.startsWith("/signup");
      const hideProfile = location.pathname.startsWith("/profile");
      const hideFlash = location.pathname.startsWith("/flash-sale");
  const hideOut = location.pathname.startsWith("/out-of-stock");
  const hideAdd = location.pathname.startsWith("/add-product");

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Collections', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <Box
      bg="white"
      borderBottom="1px"
      borderColor="gray.100"
      boxShadow="0 2px 20px rgba(0,0,0,0.08)"
      position="sticky"
      top="0"
      zIndex="1000"
      backdropFilter="blur(10px)"
    >
      <Container maxW="8xl">
        {/* Top bar with promo */}
        {/* <Box
          bg="gray.900"
          color="white"
          py={2}
          textAlign="center"
          fontSize="sm"
          display={{ base: 'none', md: 'block' }}
        >
            Free shipping on orders over $99 • 30-day returns
          <Text fontWeight="medium">
          </Text>
        </Box> */}

        <Flex minH="20" py={4} align="center" justify="space-between">
          {/* Premium Logo */}
          <Flex align="center">
            <Text
              fontSize="3xl"
              fontWeight="800"
              bgGradient="linear(to-r, blue.600, purple.600)"
              bgClip="text"
              letterSpacing="tight"
              _hover={{
                bgGradient: "linear(to-r, purple.600, blue.600)",
                transition: "all 0.3s ease",
              }}
              cursor="pointer"
            >
              EJ
            </Text>
            <Badge
              ml={2}
              colorScheme="blue"
              variant="subtle"
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="full"
            >
              PREMIUM
            </Badge>
          </Flex>

          {/* Desktop Navigation */}
          <Flex display={{ base: "none", lg: "flex" }} ml={10}>
            <Stack direction="row" spacing={8}>
              
              <Button
                bg="white"
                size="md"
                fontWeight="500"
                color="gray.700"
                position="relative"
                _hover={{
                  color: "blue.600",
                  bg: "transparent",
                  transform: "translateY(-1px)",
                  _after: {
                    width: "100%",
                    opacity: 1,
                  },
                }}
                _after={{
                  content: '""',
                  position: "absolute",
                  bottom: "-4px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "0%",
                  height: "2px",
                  bg: "blue.600",
                  opacity: 0,
                  transition: "all 0.3s ease",
                }}
                transition="all 0.2s ease"
              >
                <BrandDropdown label="Shop" />
              </Button>
              <Button
                variant="ghost"
                bg="white"
                size="md"
                fontWeight="500"
                color="gray.700"
                position="relative"
                _hover={{
                  color: "blue.600",
                  bg: "transparent",
                  transform: "translateY(-1px)",
                  _after: {
                    width: "100%",
                    opacity: 1,
                  },
                }}
                _after={{
                  content: '""',
                  position: "absolute",
                  bottom: "-4px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "0%",
                  height: "2px",
                  bg: "blue.600",
                  opacity: 0,
                  transition: "all 0.3s ease",
                }}
                transition="all 0.2s ease"
              >
                <CategoryDropdown label="Collections" />
              </Button>
              {user?.role &&
                (user.role === "admin" || user.role === "staff") &&
                !hideOut && (
                  <Button
                    as="a"
                    href="/out-of-stock"
                    variant="ghost"
                    size="md"
                    fontWeight="500"
                    color="gray.700"
                    position="relative"
                    _hover={{
                      color: "blue.600",
                      bg: "transparent",
                      transform: "translateY(-1px)",
                      _after: {
                        width: "100%",
                        opacity: 1,
                      },
                    }}
                    _after={{
                      content: '""',
                      position: "absolute",
                      bottom: "-4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "0%",
                      height: "2px",
                      bg: "blue.600",
                      opacity: 0,
                      transition: "all 0.3s ease",
                    }}
                    transition="all 0.2s ease"
                  >
                    Out of stock
                  </Button>
                )}
              {user?.role &&
                (user.role === "admin" || user.role === "staff") &&
                !hideAdd && (
                  <Button
                    as="a"
                    href="/add-product"
                    variant="ghost"
                    size="md"
                    fontWeight="500"
                    color="gray.700"
                    position="relative"
                    _hover={{
                      color: "blue.600",
                      bg: "transparent",
                      transform: "translateY(-1px)",
                      _after: {
                        width: "100%",
                        opacity: 1,
                      },
                    }}
                    _after={{
                      content: '""',
                      position: "absolute",
                      bottom: "-4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "0%",
                      height: "2px",
                      bg: "blue.600",
                      opacity: 0,
                      transition: "all 0.3s ease",
                    }}
                    transition="all 0.2s ease"
                  >
                    Add Items
                  </Button>
                )}
            </Stack>
          </Flex>

          {/* Premium Search Bar - Desktop */}
          <Box
            display={{ base: "none", md: "flex" }}
            flex="1"
            maxW="250"
            mx={6}
          >
            <SearchBar />
          </Box>

          {/* Right side premium actions */}
          {/* <Flex align="center" spacing={2}> */}
          {/* Search icon for mobile */}
          {/* <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<Search size={20} />}
              variant="ghost"
              size="md"
              aria-label="Search"
              color="gray.700"
              _hover={{
                color: "blue.600",
                bg: "blue.50",
                transform: "scale(1.05)",
              }}
              transition="all 0.2s ease"
            /> */}

          {/* Wishlist */}
          {/* <IconButton
              display={{ base: 'none', sm: 'flex' }}
              icon={<Heart size={20} />}
              variant="ghost"
              size="md"
              aria-label="Wishlist"
              color="gray.700"
              _hover={{
                color: 'red.500',
                bg: 'red.50',
                transform: 'scale(1.05)'
              }}
              transition="all 0.2s ease"
            /> */}

          {/* {!hideFlash && (
            <Button
              as="a"
              href="/flash-sale"
              variant="ghost"
              size="md"
              fontWeight="500"
              color="gray.700"
              position="relative"
              _hover={{
                color: "blue.600",
                bg: "transparent",
                transform: "translateY(-1px)",
                _after: {
                  width: "100%",
                  opacity: 1,
                },
              }}
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-4px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "0%",
                height: "2px",
                bg: "blue.600",
                opacity: 0,
                transition: "all 0.3s ease",
              }}
              transition="all 0.2s ease"
            >
              Hot Deals
            </Button> */}
          {/* )} */}

          {/* User Account */}

          {user && !hideProfile ? (
            <Button
              display= "inline-flex"
              variant="ghost"
              size="md"
              leftIcon={<User size={18} />}
              fontWeight="500"
              color="gray.700"
              _hover={{
                color: "blue.600",
                bg: "blue.50",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s ease"
              onClick={() => startTransition(() => navigate("/profile"))} // <<< change
            >
              Account
            </Button>
          ) : (
            !user &&
            !hideLogin && (
              <Button
                display= "inline-flex"s
                variant="ghost"
                size="md"
                leftIcon={<User size={18} />}
                fontWeight="500"
                color="gray.700"
                _hover={{
                  color: "blue.600",
                  bg: "blue.50",
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s ease"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )
          )}
          {!user && !hideSignup && (
            <Button
              display={{ base: "none", sm: "inline-flex" }}
              variant="ghost"
              size="md"
              leftIcon={<User size={18} />}
              fontWeight="500"
              color="gray.700"
              _hover={{
                color: "blue.600",
                bg: "blue.50",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s ease"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Button>
          )}

          {/* Cart Icon with item count */}
          {user && (
            <Button
              display="inline-flex"
              variant="ghost"
              size="md"
              fontWeight="500"
              color="gray.700"
              _hover={{
                color: "blue.600",
                bg: "blue.50",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s ease"
              onClick={() => navigate("/cart")}
            >
              <CartIcon itemCount={<CartCount />} />
            </Button>
          )}

          {/* Mobile menu button */}
          <IconButton
            display={{ base: "flex", lg: "none" }}
            onClick={onToggle}
            icon={<Menu size={20} />}
            variant="ghost"
            size="md"
            aria-label="Toggle Navigation"
            color="gray.700"
            _hover={{
              color: "blue.600",
              bg: "blue.50",
              transform: "rotate(90deg)",
            }}
            transition="all 0.3s ease"
          />
        </Flex>

        {/* Mobile Search Bar */}
        <Box display={{ md: "none" }} pb={4}>
          <SearchBar />
        </Box>

        {/* Premium Mobile Navigation Menu */}
        {isOpen && (
          <Box
            display={{ lg: "none" }}
            borderTop="1px"
            borderColor="gray.100"
            pb={6}
            bg="white"
            boxShadow="0 10px 30px rgba(0,0,0,0.1)"
            borderRadius="0 0 xl xl"
          >
            <Stack pt={4} pb={3} spacing={1}>
              {navigationLinks.map((link) => (
                <Button
                  key={link.name}
                  as="a"
                  href={link.href}
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={onToggle}
                  size="lg"
                  fontWeight="500"
                  color="gray.700"
                  _hover={{
                    color: "blue.600",
                    bg: "blue.50",
                    transform: "translateX(8px)",
                  }}
                  transition="all 0.2s ease"
                >
                  {link.name}
                </Button>
              ))}
              <Box borderTop="1px" borderColor="gray.100" pt={4} mt={2}>
                <Button
                  as="a"
                  href="/account"
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<User size={18} />}
                  size="lg"
                  fontWeight="500"
                  color="gray.700"
                  _hover={{
                    color: "blue.600",
                    bg: "blue.50",
                    transform: "translateX(8px)",
                  }}
                  transition="all 0.2s ease"
                >
                  My Account
                </Button>
                <Button
                  as="a"
                  href="/wishlist"
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<Heart size={18} />}
                  size="lg"
                  fontWeight="500"
                  color="gray.700"
                  _hover={{
                    color: "red.500",
                    bg: "red.50",
                    transform: "translateX(8px)",
                  }}
                  transition="all 0.2s ease"
                >
                  Wishlist
                </Button>
              </Box>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Header;