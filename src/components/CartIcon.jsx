// import { Box, IconButton, Text } from "@chakra-ui/react";
// import { ShoppingCart } from "lucide-react";

// const CartIcon = ({ itemCount = 0 }) => {
//   return (
//     <Box position="relative">
//       <IconButton
//         icon={<ShoppingCart size={20} />}
//         variant="ghost"
//         size="md"
//         aria-label="Shopping Cart"
//         color="gray.700"
//         _hover={{
//           color: "blue.600",
//           bg: "blue.50",
//           transform: "scale(1.05)",
//         }}
//         transition="all 0.2s ease"
//       />
//       {itemCount > 0 && (
//         <Box
//           position="absolute"
//           top="-1"
//           right="-1"
//           bg="gradient(to-r, red.500, pink.500)"
//           bgGradient="linear(to-r, red.500, pink.500)"
//           color="white"
//           borderRadius="full"
//           h="6"
//           w="6"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           border="2px"
//           borderColor="white"
//           boxShadow="0 2px 8px rgba(0,0,0,0.15)"
//           animation="pulse 2s infinite"
//         >
//           <Text fontSize="xs" fontWeight="bold">
//             {itemCount > 99 ? "99+" : itemCount}
//           </Text>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default CartIcon;
// src/components/CartIcon.js
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext"; // ✅ Import your cart context

const CartIcon = () => {
  const { cart } = useCart(); // ✅ Use cart from context

  // Calculate total item count (e.g., sum of quantities)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box position="relative">
      <IconButton
        icon={<ShoppingCart size={20} />}
        variant="ghost"
        size="md"
        aria-label="Shopping Cart"
        color="gray.700"
        _hover={{
          color: "blue.600",
          bg: "blue.50",
          transform: "scale(1.05)",
        }}
        transition="all 0.2s ease"
      />
      {itemCount > 0 && (
        <Box
          position="absolute"
          top="-1"
          right="-1"
          bgGradient="linear(to-r, red.500, pink.500)"
          color="white"
          borderRadius="full"
          h="6"
          w="6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="2px"
          borderColor="white"
          boxShadow="0 2px 8px rgba(0,0,0,0.15)"
          animation="pulse 2s infinite"
        >
          <Text fontSize="xs" fontWeight="bold">
            {itemCount > 99 ? "99+" : itemCount}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default CartIcon;
