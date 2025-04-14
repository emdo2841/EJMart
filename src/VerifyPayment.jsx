// src/pages/VerifyPayment.js
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Spinner, Text, Heading, VStack } from "@chakra-ui/react";
import api from "./context/api";

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const reference = searchParams.get("reference");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/transact/verify-payment/${reference}`);
        if (res.data?.transaction?.status === "completed") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
      }
    };

    if (reference) {
      verify();
    } else {
      setStatus("invalid");
    }
  }, [reference]);

  return (
    <Box minH="80vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4}>
        {status === "verifying" && (
          <>
            <Spinner size="xl" />
            <Text>Verifying your payment...</Text>
          </>
        )}
        {status === "success" && (
          <>
            <Heading color="green.500">Payment Successful!</Heading>
            <Text>Thank you for your purchase.</Text>
          </>
        )}
        {status === "failed" && (
          <>
            <Heading color="red.500">Payment Failed</Heading>
            <Text>Something went wrong while verifying your payment.</Text>
          </>
        )}
        {status === "invalid" && (
          <>
            <Heading color="orange.400">Invalid Request</Heading>
            <Text>No reference found in the URL.</Text>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default VerifyPayment;
