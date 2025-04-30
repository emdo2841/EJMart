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
    color: brown;
    text-shadow: 0 0 5px brown;
  }
  50% {
    color: cream;
    text-shadow: 0 0 5px cream;
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

const GlowingText = ({ children }) => {
  return (
    <Text  sx={{ animation }}>
      {children}
    </Text>
  );
};

export default GlowingText;
