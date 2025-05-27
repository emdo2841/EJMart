import { useState } from "react";
import { useNavigate } from "react-router-dom"
import {
  Box,
  Input,
  IconButton,
  InputGroup,
  InputAddon,
} from "@chakra-ui/react";
import { Search } from "lucide-react";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setSearchQuery(" ")
    // Here you would typically handle the search logic
  };

  return (
    <Box as="form" onSubmit={handleSearch} w="full">
      <InputGroup size="lg">
        <Input
          type="text"
          placeholder="Search luxury products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        
          }
          bg="gray.50"
          border="2px"
        
          borderColor="gray.200"
          borderRadius="full"
          fontSize="md"
          fontWeight="400"
          px={6}
          _placeholder={{
            color: "gray.500",
            fontWeight: "400",
          }}
          _focus={{
            bg: "white",
            borderColor: "blue.500",
            boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
            transform: "scale(1.02)",
          }}
          _hover={{
            borderColor: "gray.300",
            bg: "white",
          }}
          transition="all 0.2s ease"
        />
        <InputAddon placement="end" bg="transparent" border="none" pr={2}>
          <IconButton
            type="submit"
            icon={<Search size={18} />}
            size="md"
            variant="ghost"
            aria-label="Search"
            color="gray.600"
            borderRadius="full"
            _hover={{
              color: "blue.600",
              bg: "blue.50",
              transform: "scale(1.1)",
            }}
            transition="all 0.2s ease"
            onClick={() =>
              navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            }
          />
        </InputAddon>
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
