import React, { useRef } from "react";
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  Flex,
  List,
  ListItem,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Link as ChakraLink,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { Routes, Route, useLocation } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import Form from "./form";
import LoginForm from "./login";
import Logout from "./logout";
import ProtectedRoute from "./ProtectedRoute";
import EbookForm from "./postEbook";
import Products from "./fetch";
import { useAuth } from "./context/authContext";
import ProductDetails from "./fetch_id";
import ForgetPassword from "./forgetPassword";
import ResetPassword from "./ResetPassword"
import UpdatePassword from "./UpdatePassword";
import CartCount from "./utilities/cartCount";
import Cart from "./cart";
import Checkout from "./checkout";
import VerifyPayment from "./VerifyPayment";
import GetAllUsers from "./getAllUser";
import UserDetails from "./getUser";
import UpdateUserRole from "./updateRole";
import BrandProductSelector from "./brandProduct";
import CategoryProductSelector from "./categoryProduct";
import AddReview from "./AddReview";
import UpdateReview from "./UpdateReview";
import UpdateProduct from "./update";
import OutOfStockProducts from "./OutOfStock";
import FlashSale from "./FlashSale";
import AddProductImage from "./EditImages";
import ReplaceProductImage from "./ReplaceProductImages";
import RemoveProductImages from "./RemoveProductImage"

const Profile = React.lazy(() => import("./profile")); // Lazy load the Profile component
// Define theme

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

const App = () => {
  const { user } = useAuth();
  const location = useLocation();

  const hideLogin = location.pathname.startsWith("/login");
  const hideSignup = location.pathname.startsWith("/signup");
  const hideLogout = location.pathname.startsWith("/logout");
  const hideAdd = location.pathname.startsWith("/add-product");
  const showProductsOnRoot = location.pathname === "/";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {/* Responsive Nav */}
      <Flex
        justify="space-between"
        align="center"
        p="4"
        position="sticky"
        top="0"
        zIndex="999"
        bg="gray.50"
        _dark={{ bg: "gray.800" }}
        boxShadow="sm"
      >
        {/* Hamburger icon for mobile */}
        <IconButton
          ref={btnRef}
          icon={<HamburgerIcon />}
          onClick={onOpen}
          display={{ base: "block", md: "none" }} // Show only on mobile
          aria-label="Open menu"
        />

        {/* Logo */}
        <Flex
          justify={{ base: "flex-end", md: "flex-start" }} // Flex-end on mobile, flex-start on desktop
          align="center"
          gap="4"
          flex="1"
        >
          <ChakraLink
            as={Link}
            to="/"
            transition="all 0.2s"
            _hover={{
              transform: "scale(1.02)",
              textDecoration: "none",
            }}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon as={FaShoppingCart} boxSize={6} color="blue.500" />
            <Text fontSize="lg" fontWeight="bold" color="blue.600">
              EJ Mart
            </Text>
          </ChakraLink>
        </Flex>

        {/* Cart Manager */}
        <Flex
          justify="flex-end"
          align="center"
          gap="4"
          flex="1"
          display={{ base: "flex", md: "none" }} // Show only on mobile
        >
          {user && (
            <>
              <ChakraLink
                as={Link}
                to="/cart"
                transition="all 0.2s"
                _hover={{
                  transform: "scale(1.02)",
                  textDecoration: "none",
                }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaShoppingCart} boxSize={6} color="blue.500" />
              </ChakraLink>
              <CartCount /> {/* Display the number of items in the cart */}
            </>
          )}
        </Flex>

        {/* Desktop nav (top-right) */}
        <Flex
          display={{ base: "none", md: "flex" }} // Show only on desktop
          justify="flex-end"
          align="center"
          gap="4"
          flex="1"
        >
          <List display="flex" flexDirection="row" gap="4" m="0">
            {user && (
              <ListItem>
                <ChakraLink
                  as={Link}
                  to="/cart"
                  transition="all 0.2s"
                  _hover={{
                    transform: "scale(1.02)",
                    textDecoration: "none",
                  }}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={FaShoppingCart} boxSize={6} color="blue.500" />
                </ChakraLink>
              </ListItem>
            )}

            {user && (
              <ListItem
                color="blue.700"
                transition="all 0.2s"
                _hover={{
                  transform: "scale(1.02)",
                  textDecoration: "none",
                }}
              >
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  <CartCount />
                </Text>
              </ListItem>
            )}
            <ListItem>
              <ChakraLink
                as={Link}
                to="/browse-by-brand"
                transition="all 0.2s"
                _hover={{
                  transform: "scale(1.02)",
                  textDecoration: "none",
                }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  Brands
                </Text>
              </ChakraLink>
            </ListItem>
            <ListItem>
              <ChakraLink
                as={Link}
                to="/browse-by-category"
                transition="all 0.2s"
                _hover={{
                  transform: "scale(1.02)",
                  textDecoration: "none",
                }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  Categories
                </Text>
              </ChakraLink>
            </ListItem>
            {!user && (
              <>
                {!hideSignup && (
                  <ChakraLink
                    as={Link}
                    to="/signup"
                    transition="all 0.2s"
                    _hover={{
                      transform: "scale(1.02)",
                      textDecoration: "none",
                    }}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon as={FaUserPlus} boxSize={4} color="blue.500" />
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      Signup
                    </Text>
                  </ChakraLink>
                )}
                {!hideLogin && (
                  <ChakraLink
                    as={Link}
                    to="/login"
                    transition="all 0.2s"
                    _hover={{
                      transform: "scale(1.02)",
                      textDecoration: "none",
                    }}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon as={FaSignInAlt} boxSize={4} color="blue.500" />
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      Login
                    </Text>
                  </ChakraLink>
                )}
              </>
            )}

            {user?.role &&
              (user.role === "admin" || user.role === "staff") &&
              !hideAdd && (
                <ListItem>
                  <ChakraLink
                    as={Link}
                    to="/add-product"
                    transition="all 0.2s"
                    _hover={{
                      transform: "scale(1.02)",
                      textDecoration: "none",
                    }}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      Add Product
                    </Text>
                  </ChakraLink>
                </ListItem>
              )}

            {user?.role === "admin" && (
              <ChakraLink
                as={Link}
                to="/users"
                transition="all 0.2s"
                _hover={{
                  transform: "scale(1.02)",
                  textDecoration: "none",
                }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  Users
                </Text>
              </ChakraLink>
            )}

            {user && !hideLogout && (
              <ChakraLink
                as={Link}
                to="/logout"
                transition="all 0.2s"
                _hover={{
                  transform: "scale(1.02)",
                  textDecoration: "none",
                }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaSignOutAlt} boxSize={4} color="blue.500" />
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  Logout
                </Text>
              </ChakraLink>
            )}
          </List>
          <DarkModeToggle />
        </Flex>
      </Flex>
      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <List spacing={4}>
              {!user && (
                <>
                  {!hideSignup && (
                    <ListItem>
                      <Link to="/form" onClick={onClose}>
                        <Text fontSize="lg" fontWeight="bold" color="blue.600">
                          Signup
                        </Text>
                      </Link>
                    </ListItem>
                  )}
                  {!hideLogin && (
                    <ListItem>
                      <Link to="/login" onClick={onClose}>
                        <Text fontSize="lg" fontWeight="bold" color="blue.600">
                          Login
                        </Text>
                      </Link>
                    </ListItem>
                  )}
                </>
              )}
              {user?.role &&
                (user.role === "admin" || user.role === "staff") &&
                !hideAdd && (
                  <ListItem>
                    <Link to="/add-product" onClick={onClose}>
                      <Text fontSize="lg" fontWeight="bold" color="blue.600">
                        Add New Product
                      </Text>
                    </Link>
                  </ListItem>
                )}
              {user?.role === "admin" && !hideAdd && (
                <ListItem>
                  <Link to="/users" onClick={onClose}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      Users
                    </Text>
                  </Link>
                </ListItem>
              )}
              {user && !hideLogout && (
                <ListItem>
                  <Link to="/logout" onClick={onClose}>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      logout
                    </Text>
                  </Link>
                </ListItem>
              )}
              <ListItem>
                <ChakraLink
                  as={Link}
                  to="/browse-by-brand"
                  transition="all 0.2s"
                  _hover={{
                    transform: "scale(1.02)",
                    textDecoration: "none",
                  }}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    Brands
                  </Text>
                </ChakraLink>
              </ListItem>
              <ListItem>
                <ChakraLink
                  as={Link}
                  to="/browse-by-category"
                  transition="all 0.2s"
                  _hover={{
                    transform: "scale(1.02)",
                    textDecoration: "none",
                  }}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    Categories
                  </Text>
                </ChakraLink>
              </ListItem>
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Products shown on home route only */}
      {showProductsOnRoot && <Products />}
      {/* Routes */}
      <Routes>
        <Route path="/signup" element={<Form />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/update-password"
          element={<ProtectedRoute element={<UpdatePassword />} />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/transact" element={<Checkout user={user} />} />
        <Route path="/verify-payment" element={<VerifyPayment />} />
        <Route path="/add-review" element={<AddReview />} />
        <Route path="/flash-sale" element={<FlashSale />} />
        <Route path="/update-review/:productId" element={<UpdateReview />} />
        <Route
          path="/browse-by-brand"
          element={<BrandProductSelector />}
        />{" "}
        {/* NEW LINE */}
        <Route
          path="/browse-by-category"
          element={<CategoryProductSelector />}
        />
        <Route
          path="/update-product/:productId"
          element={
            <ProtectedRoute
              element={<UpdateProduct />}
              roles={["admin", "staff"]}
            />
          }
        />
        <Route
          path="/add-product-image/:productId"
          element={
            <ProtectedRoute
              element={<AddProductImage />}
              roles={["admin", "staff"]}
            />
          }
        />
        <Route
          path="/replace-product-image/:productId"
          element={
            <ProtectedRoute
              element={<ReplaceProductImage />}
              roles={["admin", "staff"]}
            />
          }
        />
        <Route
          path="/remove-image/:productId"
          element={
            <ProtectedRoute
              element={<RemoveProductImages />}
              roles={["admin", "staff"]}
            />
          }
        />
        <Route
          path="/out-of-stock"
          element={
            <ProtectedRoute
              element={<OutOfStockProducts />}
              roles={["admin", "staff"]}
            />
          }
        />
        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute element={<UserDetails />} roles={["admin"]} />
          }
        />
        <Route
          path="/update-role/:id"
          element={
            <ProtectedRoute element={<UpdateUserRole />} roles={["admin"]} />
          }
        />
        <Route
          path="/ex-product/:id"
          element={
            <ProtectedRoute element={<UpdateUserRole />} roles={["admin"]} />
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute
              element={<EbookForm />}
              roles={["admin", "staff"]}
            />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute element={<GetAllUsers />} roles={["admin"]} />
          }
        />
      </Routes>
    </ChakraProvider>
  );
};

// Dark mode toggle
// Dark Mode Toggle button positioned at the bottom-right corner
const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      onClick={toggleColorMode}
      position="fixed"
      bottom="10px" // Adjust bottom distance as needed
      right="10px" // Adjust right distance as needed
      zIndex="999"
    >
      {colorMode === "light" ? "Dark Mode 🌙" : "Light Mode ☀️"}
    </Button>
  );
};

export default App;
