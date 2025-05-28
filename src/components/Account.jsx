import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
// import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { startTransition } from "react";
import { User } from "lucide-react";
import { FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../context/authContext";

const AccountMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const hideProfile = location.pathname.startsWith("/profile");
 
      
       
    const hideLogin = location.pathname.startsWith("/login");
        
         
      const hideSignup = location.pathname.startsWith("/signup");

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
        {user && !hideProfile && (
          <MenuItem
            leftIcon={<User size={18} />}
            onClick={() => handleNavigate("/profile")}
          >
            Profile
          </MenuItem>
        )}
        {!user && !hideLogin && (
          <MenuItem
            as={Button}
            rightIcon={<FaSignInAlt size={18} />}
            onClick={() => handleNavigate("/login")}
          >
            login
          </MenuItem>
        )}
        {!user && !hideSignup && (
          <MenuItem
            as={Button}
            rightIcon={<FaUserPlus />}
            onClick={() => handleNavigate("/signup")}
          >Sign Up</MenuItem>
        )}
        {user && (
          <MenuItem onClick={() => handleNavigate("/order")}>Order</MenuItem>
        )}
        {user && (
          <MenuItem leftIcon={<FaSignOutAlt />} as={Link} to="/logout">
            Logout
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default AccountMenu;
