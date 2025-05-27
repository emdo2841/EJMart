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
// import { Link } from "react-router-dom";
import api from "../context/api";

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
                variant="ghost"
                size="xm"
                border="none"
                fontWeight="500"
                color="gray.700"
                bg="white"
      >
        Brands
      </MenuButton>
      <MenuList border="none" >
        {brands.map((brand) => (
          <MenuItem key={brand._id} onClick={() => handleBrandClick(brand._id)}>
            <Text color="blue.700">{brand.name}</Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
  };

export default BrandDropdown;