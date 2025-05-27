// import React from 'react';
// import {
//   Box,
//   Flex,
//   HStack,
//   IconButton,
//   Button,
//   useDisclosure,
//   Stack,
//   Text,
// } from '@chakra-ui/react';
// import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

// const Links = ['Home', 'About', 'Services', 'Contact'];

// const NavLink = ({ children }) => (
//   <Button
//     variant="ghost"
//     _hover={{ bg: 'gray.200' }}
//     px={3}
//     py={2}
//     rounded="md"
//   >
//     {children}
//   </Button>
// );

// export default function HeadingNavbar() {
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   return (
//     <Box bg="teal.500" px={4}>
//       <Flex h={16} alignItems="center" justifyContent="space-between">
//         <Text fontSize="xl" fontWeight="bold" color="white">
//           MyBrand
//         </Text>

//         <IconButton
//           size="md"
//           icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
//           aria-label="Toggle Menu"
//           display={{ md: 'none' }}
//           onClick={isOpen ? onClose : onOpen}
//         />

//         <HStack spacing={8} alignItems="center" display={{ base: 'none', md: 'flex' }}>
//           {Links.map((link) => (
//             <NavLink key={link}>{link}</NavLink>
//           ))}
//         </HStack>
//       </Flex>

//       {isOpen ? (
//         <Box pb={4} display={{ md: 'none' }}>
//           <Stack as="nav" spacing={4}>
//             {Links.map((link) => (
//               <NavLink key={link}>{link}</NavLink>
//             ))}
//           </Stack>
//         </Box>
//       ) : null}
//     </Box>
//   );
// }
import React from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Badge,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { FaShoppingCart } from "react-icons/fa";

const Links = ["Home", "Shop", "Contact"];

const NavLink = ({ children, onClick }) => (
  <Button
    variant="ghost"
    _hover={{ bg: "gray.100" }}
    px={3}
    py={2}
    rounded="md"
    onClick={onClick}
  >
    {children}
  </Button>
);

export default function HeadingNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cartItemCount = 3; // Replace with dynamic value if needed

  const handleLinkClick = () => {
    if (isOpen) onClose();
  };

  return (
    <Box bg="white" px={4} boxShadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Text fontSize="2xl" fontWeight="bold" color="teal.500">
          ShopMate
        </Text>

        {/* Mobile Hamburger */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Toggle Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />

        {/* Desktop Nav */}
        <HStack
          spacing={6}
          alignItems="center"
          display={{ base: "none", md: "flex" }}
        >
          {Links.map((link) => (
            <NavLink key={link}>{link}</NavLink>
          ))}

          {/* Search bar */}
          <InputGroup maxW="300px">
            <Input placeholder="Search products..." />
            <InputRightElement>
              <IconButton
                size="sm"
                icon={<SearchIcon />}
                aria-label="Search"
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>

          {/* Cart */}
          <IconButton
            variant="ghost"
            icon={
              <Box position="relative">
                <FaShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="-1"
                    right="-2"
                    fontSize="0.7em"
                    px={1.5}
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Box>
            }
            aria-label="Cart"
          />
        </HStack>
      </Flex>

      {/* Mobile Menu */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4}>
            {Links.map((link) => (
              <NavLink key={link} onClick={handleLinkClick}>
                {link}
              </NavLink>
            ))}

            {/* Mobile search */}
            <InputGroup>
              <Input placeholder="Search products..." />
              <InputRightElement>
                <IconButton
                  size="sm"
                  icon={<SearchIcon />}
                  aria-label="Search"
                  variant="ghost"
                  onClick={handleLinkClick}
                />
              </InputRightElement>
            </InputGroup>

            {/* Cart (mobile) */}
            <Button
              variant="ghost"
              leftIcon={<FaShoppingCart />}
              onClick={handleLinkClick}
            >
              Cart ({cartItemCount})
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
