import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import api from "./context/api";

const CategoryDropdown = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category"); // Adjust the endpoint if necessary
        setBrands(response.data.data || []); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching categoriess:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        colorScheme="blue"
        variant="link"
        fontSize="lg"
        fontWeight="bold"
      >
        Categories
      </MenuButton>
      <MenuList width="50px">
        {brands.map((category) => (
          <MenuItem key={category._id}>
            <ChakraLink
              as={Link}
              to={`/browse-by-category/${category._id}`}
              _hover={{ textDecoration: "none" }}
            >
              <Text color="blue.600">{category.name}</Text>
            </ChakraLink>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default CategoryDropdown;