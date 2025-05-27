import React from "react";
import { Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Define keyframes for color and glow
const glowCycle = keyframes`
  0% {
    color: red;
    text-shadow: 0 0 5px red;
  }
  25% {
    color: blue;
    text-shadow: 0 0 5px blue;
  }
  50% {
    color: lime;
    text-shadow: 0 0 5px lime;
  }
  75% {
    color: orange;
    text-shadow: 0 0 5px orange;
  }
  100% {
    color: red;
    text-shadow: 0 0 5px red;
  }
`;

const animation = `${glowCycle} 1s linear infinite`;

const GlowingHead = ({ children = "Products" }) => {
  return (
    <Text fontSize="2xl" fontWeight="bold" mb="8" sx={{ animation }}>
      {children}
    </Text>
  );
};

export default GlowingHead;
