import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,

} from "@chakra-ui/react";
// import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { startTransition } from "react";
import {  User } from "lucide-react";
import { FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../context/authContext";

const AccountMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleNavigate = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };
  return (
    <Menu>
      <MenuButton
        as={Button}
        display="inline-flex"
        variant="ghost"
        size="md"
        leftIcon={<User size={18} />}
        fontWeight="500"
        color="gray.700"
        _hover={{
          color: "blue.600",
          bg: "blue.50",
          transform: "translateY(-1px)",
        }}
        transition="all 0.2s ease"
      >
        Account
      </MenuButton>
      <MenuList>
        <MenuItem
          leftIcon={<User size={18} />}
          onClick={() => handleNavigate("/profile")}
        >
          Profile
        </MenuItem>
        {!user && (
          <MenuItem
            as={Button}
            leftIcon={<FaSignInAlt size={18} />}
            onClick={() => handleNavigate("/login")}
          >
            login
          </MenuItem>
        )}
        {!user && (
          <MenuItem
            as={Button}
            leftIcon={<FaUserPlus />}
            onClick={() => handleNavigate("/signup")}
          ></MenuItem>
        )}
              {user && (<MenuItem onClick={() => handleNavigate("/order")}>Order</MenuItem>)}
              {user && (<MenuItem leftIcon={<FaSignOutAlt />} as={Link} to="/logout">
                  Logout
              </MenuItem>)}
      </MenuList>
    </Menu>
  );
};

export default AccountMenu;
