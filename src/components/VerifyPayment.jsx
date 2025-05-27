// // src/pages/VerifyPayment.js
// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { Box, Spinner, Text, Heading, VStack } from "@chakra-ui/react";
// import api from "./context/api";
// import {useCart} from "./context/CartContext"

// const VerifyPayment = () => {
//   const [searchParams] = useSearchParams();
//   const [status, setStatus] = useState("verifying");
//   const reference = searchParams.get("reference");
//   const { clearCart } = useCart();
//   useEffect(() => {
//     const verify = async () => {
//       try {
//         const res = await api.get(`/transact/verify-payment/${reference}`);
//         if (res.data?.transaction?.status === "completed") {
//           setStatus("success");
//           clearCart(); // Clear the cart after successful payment
//         } else if (res.data?.transaction?.status === "pending") {
//           setStatus("pending");
//         } else {
//           setStatus("failed");
//         }
//       } catch (err) {
//         console.error("Verification error:", err);
//         setStatus("failed");
//       }
//     };

//     if (reference) {
//       verify();
//     } else {
//       setStatus("invalid");
//     }
//   }, [reference, clearCart]);

//   return (
//     <Box minH="80vh" display="flex" alignItems="center" justifyContent="center">
//       <VStack spacing={4}>
//         {status === "verifying" && (
//           <>
//             <Spinner size="xl" />
//             <Text>Verifying your payment...</Text>
//           </>
//         )}
//         {status === "success" && (
//           <>
//             <Heading color="green.500">Payment Successful!</Heading>
//             <Text>Thank you for your purchase.</Text>
//           </>
//         )}
//         {status === "failed" && (
//           <>
//             <Heading color="red.500">Payment Failed</Heading>
//             <Text>Something went wrong while verifying your payment.</Text>
//           </>
//         )}
//         {status === "invalid" && (
//           <>
//             <Heading color="orange.400">Invalid Request</Heading>
//             <Text>No reference found in the URL.</Text>
//           </>
//         )}
//         {status === "pending" && (
//           <>
//             <Heading color="orange.400">Payment Pending</Heading>
//             <Text>Be patient or please contact our customer service</Text>
//           </>
//         )}
//       </VStack>
//     </Box>
//   );
// };

// export default VerifyPayment;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // <-- useParams instead of useSearchParams
import { Box, Spinner, Text, Heading, VStack } from "@chakra-ui/react";
import api from "../context/api";
import { useCart } from "../context/CartContext";

const VerifyPayment = () => {
  const { reference } = useParams(); // <- get reference from URL
  const [status, setStatus] = useState("verifying");
  const [countdown, setCountdown] = useState(3); 
  const { clearCart } = useCart();
  const navigate = useNavigate(); // <-- initialize navigate

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/transact/verify-payment/${reference}`);
        if (res.data?.transaction?.status === "completed") {
          setStatus("success");
          clearCart();
        } else if (res.data?.transaction?.status === "pending") {
          setStatus("pending");
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
  }, [reference, clearCart]);
 useEffect(() => {
   let timer;
   if (status === "success" && countdown > 0) {
     timer = setTimeout(() => {
       setCountdown((prev) => prev - 1);
     }, 1000);
   } else if (status === "success" && countdown === 0) {
     navigate("/"); // <-- redirect to home or orders page
   }

   return () => clearTimeout(timer);
 }, [status, countdown, navigate]);

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
        {status === "pending" && (
          <>
            <Heading color="orange.400">Payment Pending</Heading>
            <Text>Be patient or please contact our customer service</Text>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default VerifyPayment;
