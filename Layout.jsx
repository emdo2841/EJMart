// Layout.js
import { Outlet } from "react-router-dom";
import Footer from "./src/Footer";
import { Flex } from "@chakra-ui/react";

const Layout = () => {
  return (
    <>
      <main>
        <Outlet /> {/* This renders the matched child route */}
      </main>
      <Flex direction="column" minH="100vh">
        <Footer /> {/* This will always render below */}
      </Flex>
    </>
  );
};

export default Layout;
