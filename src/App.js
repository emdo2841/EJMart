import React, { useRef, useState } from "react";
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
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { Input} from "@chakra-ui/react";
// import { FaSignInAlt, FaUserPlus,  } from "react-icons/fa";
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
import BrandDropdown from "./BrandDropdown";
import CategoryDropdown from "./CategoryDrpdown";
import Footer from "./Footer";
import UpdateProfile from "./UpdateProfile"
import GlowingText from "./animation";
import ErrorPage from "./Error";
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
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const hideFlash = location.pathname.startsWith("/flash-sale");
  const hideOut = location.pathname.startsWith("/out-of-stock");
  const hideUser = location.pathname.startsWith("/user");
  // const hideLogout = location.pathname.startsWith("/logout");
  const hideAdd = location.pathname.startsWith("/add-product");


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
        {/* 1. Hamburger (mobile only) */}
        <IconButton
          ref={btnRef}
          icon={<HamburgerIcon />}
          onClick={onOpen}
          display={{ base: "block", md: "none" }}
          aria-label="Open menu"
        />

        {/* 2. Logo (always visible) */}
        <ChakraLink
          as={Link}
          to="/"
          display="flex"
          alignItems="center"
          gap="2"
          // on mobile this sits immediately after hamburger
          // on desktop it’s flush left of the whole header
          flex={{ base: "none", md: "1" }}
          justify={{ base: "flex-start", md: "flex-start" }}
        >
          <Icon
            as={FaShoppingCart}
            boxSize={{ base: "4", sm: "4", md: "4", lg: "5", xl: "6" }}
            color="red.500"
          />
          <Text
            fontSize={{ base: "md", sm: "md", md: "lg", lg: "lg", xl: "lg" }}
            fontWeight="bold"
            color="red.700"
          >
            EJ Mart
          </Text>
        </ChakraLink>

        {/* 3. Mobile Search (only base) */}
        <Flex
          display={{ base: "flex", md: "none" }}
          align="center"
          flex="2"
          gap=" 2"
          mx="2"
        >
          <Input
            placeholder="Search products…"
            size="sm"
            value={searchInput}
            borderRadius={"md"}
            transition="all 0.2s"
            _hover={{
              transform: "scale(1.02)",
              textDecoration: "none",
              color: "teal.700",
            }}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
            }
          />
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            borderRadius={"md"}
            size="sm"
            transition="all 0.2s"
            _hover={{
              transform: "scale(1.02)",
              textDecoration: "none",
              color: "teal.700",
            }}
            onClick={() =>
              navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
            }
          />
        </Flex>

        {/* 4. Mobile Cart (only base) */}
        <Flex display={{ base: "flex", md: "none" }} align="center" gap="2">
          {user && (
            <>
              <ChakraLink
                as={Link}
                to="/cart"
                display="flex"
                alignItems="center"
              >
                <Icon
                  as={FaShoppingCart}
                  boxSize={{ base: "4", sm: "4", md: "4", lg: "5", xl: "6" }}
                  color="red.500"
                />
              </ChakraLink>
              <CartCount />
            </>
          )}
        </Flex>

        {/* Desktop nav (top-right) */}
        <Flex
          display={{ base: "none", md: "flex" }}
          justify="flex-end"
          align="center"
          gap="4"
          flex="1"
        >
          {/* your existing desktop items */}
          <Input
            placeholder="Search products…"
            size="sm"
            width="160px"
            value={searchInput}
            borderRadius={"md"}
            transition="all 0.2s"
            _hover={{
              transform: "scale(1.02)",
              textDecoration: "none",
              color: "teal.700",
            }}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
            }
          />
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            size="sm"
            transition="all 0.2s"
            _hover={{
              transform: "scale(1.02)",
              textDecoration: "none",
              color: "teal.700",
            }}
            onClick={() =>
              navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
            }
          />
          <List display="flex" flexDirection="row" gap="4" m="0">
            <ListItem>
              <BrandDropdown />
            </ListItem>
            <ListItem>
              <CategoryDropdown />
            </ListItem>
            {user?.role &&
              (user.role === "admin" || user.role === "staff") &&
              !hideOut && (
                <ChakraLink
                  as={Link}
                  to="/out-of-stock"
                  transition="all 0.2s"
                  _hover={{
                    transform: "scale(1.02)",
                    textDecoration: "none",
                    color: "teal.700",
                  }}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Text fontSize="xs" fontWeight="medium">
                    Re-STock
                  </Text>
                </ChakraLink>
              )}
            {!hideFlash && (
              <ChakraLink
                as={Link}
                to="/flash-sale"
                transition="all 0.2s"
                _hover={{
                  transform: "scale(1.02)",
                  textDecoration: "none",
                  color: "teal.700",
                }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <GlowingText fontSize="xs" fontWeight="medium">
                  Hot Deals
                </GlowingText>
              </ChakraLink>
            )}

            {user?.role &&
              (user.role === "admin" || user.role === "staff") &&
              !hideAdd && (
                <ChakraLink
                  as={Link}
                  to="/add-product"
                  transition="all 0.2s"
                  _hover={{
                    transform: "scale(1.02)",
                    textDecoration: "none",
                    color: "teal.700",
                  }}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Text fontSize="xs" fontWeight="medium">
                    Add Product
                  </Text>
                </ChakraLink>
              )}

            {user?.role === "admin" && !hideUser && (
              <ChakraLink
                as={Link}
                to="/users"
                transition="all 0.2s"
                _hover={{
                  transform: "scale(1.02)",
                  textDecoration: "none",
                  color: "teal.700",
                }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Text fontSize="xs" fontWeight="medium">
                  Users
                </Text>
              </ChakraLink>
            )}
            {user && (
              <ListItem>
                <ChakraLink
                  as={Link}
                  to="/cart"
                  transition="all 0.2s"
                  _hover={{
                    transform: "scale(1.02)",
                    textDecoration: "none",
                    color: "teal.700",
                  }}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={FaShoppingCart} boxSize={5} color="red.400" />
                </ChakraLink>
              </ListItem>
            )}

            {user && (
              <ListItem
                transition="all 0.2s"
                _hover={{
                  transform: "scale(1.02)",
                  textDecoration: "none",
                  color: "teal.700",
                }}
              >
                <Text fontSize="sm" fontWeight="mdium">
                  <CartCount />
                </Text>
              </ListItem>
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
          <DrawerHeader>EJ</DrawerHeader>
          <DrawerBody>
            {/* Search in drawer */}
            <Flex mb="4">
              <Input
                placeholder="Search products…"
                size="sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (onClose(),
                  navigate(
                    `/search?q=${encodeURIComponent(searchInput.trim())}`
                  ))
                }
              />
              <IconButton
                ml="2"
                aria-label="Search"
                icon={<SearchIcon />}
                size="sm"
                onClick={() => {
                  onClose();
                  navigate(
                    `/search?q=${encodeURIComponent(searchInput.trim())}`
                  );
                }}
              />
            </Flex>
            <List spacing={4}>
              <ListItem>
                <Link to="/flash-sale" onClick={onClose}>
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    Flash Sales
                  </Text>
                </Link>
              </ListItem>
              {user?.role &&
                (user.role === "admin" || user.role === "staff") &&
                !hideAdd && (
                  <ListItem>
                    <Link to="/out-of-stock" onClick={onClose}>
                      <Text fontSize="lg" fontWeight="bold" color="blue.600">
                        Re-STock
                      </Text>
                    </Link>
                  </ListItem>
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
              <ListItem>
                <BrandDropdown onClick={onClose} />
              </ListItem>
              <ListItem>
                <CategoryDropdown onClick={onClose} />
              </ListItem>
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Products shown on home route only */}
      {/* {showProductsOnRoot && <Products />} */}

      <Footer />
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/search" element={<Products />} />
        <Route path="/signup" element={<Form />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/update-profile/:userId"
          element={<ProtectedRoute element={<UpdateProfile />} />}
        />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/update-password"
          element={<ProtectedRoute element={<UpdatePassword />} />}
        />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/transact" element={<Checkout user={user} />} />
        <Route
          path="/verify-payment/:reference"
          element={<ProtectedRoute element={<VerifyPayment />} />}
        />
        <Route
          path="/add-review"
          element={<ProtectedRoute element={<AddReview />} />}
        />
        <Route path="/flash-sale" element={<FlashSale />} />
        <Route
          path="/update-review/:productId"
          element={<ProtectedRoute element={<UpdateReview />} />}
        />
        <Route path="/browse-by-brand/:id" element={<BrandProductSelector />} />{" "}
        {/* NEW LINE */}
        <Route
          path="/browse-by-category/:id"
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
      bottom="70px" // Adjust bottom distance as needed
      right="5px" // Adjust right distance as needed
      zIndex="1001"
      color="red.400"

    >
      {colorMode === "light" ? "Dark 🌙" : "Light ☀️"}
    </Button>
  );
};

export default App;
