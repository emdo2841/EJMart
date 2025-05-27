import React, { useRef, useState } from "react";
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  Button,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { Routes, Route, useLocation } from "react-router-dom";
import Form from "./components/form";
import LoginForm from "./components/login";
import Logout from "./components/logout";
import ProtectedRoute from "./components/ProtectedRoute";
import EbookForm from "./components/postEbook";
import Products from "./components/fetch";
import { useAuth } from "./context/authContext";
import ProductDetails from "./components/fetch_id";
import ForgetPassword from "./components/forgetPassword";
import ResetPassword from "./components/ResetPassword"
import UpdatePassword from "./components/UpdatePassword";
import Cart from "./components/cart";
import Checkout from "./components/checkout";
import VerifyPayment from "./components/VerifyPayment";
import GetAllUsers from "./components/getAllUser";
import UserDetails from "./components/getUser";
import UpdateUserRole from "./components/updateRole";
import BrandProductSelector from "./components/brandProduct";
import CategoryProductSelector from "./components/categoryProduct";
import AddReview from "./components/AddReview";
import UpdateReview from "./components/UpdateReview";
import UpdateProduct from "./components/update";
import OutOfStockProducts from "./components/OutOfStock";
import FlashSale from "./components/FlashSale";
import AddProductImage from "./components/EditImages";
import ReplaceProductImage from "./components/ReplaceProductImages";
import RemoveProductImages from "./components/RemoveProductImage"
import Footer from "./components/Footer"
import UpdateProfile from "./components/UpdateProfile"

import ErrorPage from "./components/Error";

import Header from "./components/HEADER"
const Profile = React.lazy(() => import("./components/profile")); // Lazy load the Profile component
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
  const hideFooterRoutes = ["/login", "/signup"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      <Header />

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
      {!shouldHideFooter && <Footer />}
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
