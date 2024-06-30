import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box, HStack, Text, VStack, Button, FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import { ScanIcon } from "./Icon";
import { blobToBase64, getDeviceId, resizeImage } from "../util";
import { useWallet } from "@vechain/dapp-kit-react";

import { submitReceipt } from "../networking";
import { useDisclosure, useSubmission } from "../hooks";

export const Dropzone = () => {
  const { account } = useWallet();


  const { setIsLoading, setResponse } = useSubmission();
  const { onOpen } = useDisclosure();



  const onSubmit = async () => {
    if (!account) {
      alert("Please connect your wallet");
      return;
    }

    try {
      onOpen();
      const deviceID = await getDeviceId();
      const response = await submitReceipt({
        address: account,
        deviceID,
      });

      console.log(response);

      setResponse(response);
    } catch (error) {
      alert("Error submitting receipt");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack w={"full"} mt={3}>
      <Button colorScheme='teal' variant='solid' onClick={onSubmit}>
        Claim your NFT Receipt!
      </Button>


    </VStack>
  );
};
