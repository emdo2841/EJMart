import React, { useState } from "react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";

const PasswordInput = ({ size = "md", ...props }) => {
  const [show, setShow] = useState(false);

  const togglePasswordVisibility = () => setShow(!show);

  return (
    <InputGroup size={size}>
      <Input
        type={show ? "text" : "password"}
        {...props} // Pass additional props like placeholder
      />
      <InputRightElement>
        <Button size="sm" onClick={togglePasswordVisibility}>
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
