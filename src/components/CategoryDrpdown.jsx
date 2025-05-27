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
// import { ChevronDownIcon } from "@chakra-ui/icons";
// import { Link } from "react-router-dom";
import api from "../context/api";

const CategoryDropdown = ({ onClick }) => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate(); // 👈 Add navigate

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category");
        setBrands(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (id) => {
    navigate(`/browse-by-category/${id}`); // 👈 Navigate first
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
         Collections
      </MenuButton>
      <MenuList border="none" >
        {brands.map((category) => (
          <MenuItem 
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
          >
            <Text color="blue.700">{category.name}</Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};


export default CategoryDropdown;
