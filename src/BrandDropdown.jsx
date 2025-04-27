import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  // Link as ChakraLink,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";
// import { Link } from "react-router-dom";
import api from "./context/api";

const BrandDropdown =  ({ onClick }) => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate(); // 👈 Add navigate

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("/brand");
        setBrands(response.data.data || []);
      } catch (error) {
        console.error("Error fetching Brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandClick = (id) => {
    navigate(`/browse-by-brand/${id}`); // 👈 Navigate first
    if (onClick) {
      onClick(); // 👈 Then close drawer
    }
  };
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
        <MenuList width="50px">
          {brands.map((brand) => (
            <MenuItem
              key={brand._id}
              onClick={() => handleBrandClick(brand._id)}
            >
              <Text color="blue.600">{brand.name}</Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  };

export default BrandDropdown;