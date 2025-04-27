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

const BrandDropdown = ({ onClick }) => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("/brand"); // Adjust the endpoint if necessary
        setBrands(response.data.data || []); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
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
        Brands
      </MenuButton>
      <MenuList>
        {brands.map((brand) => (
          <MenuItem key={brand._id} onClick={onClick}>
            <ChakraLink
              as={Link}
              to={`/browse-by-brand/${brand._id}`}
              _hover={{ textDecoration: "none" }}
            >
              <Text color="blue.600">{brand.name}</Text>
            </ChakraLink>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default BrandDropdown;