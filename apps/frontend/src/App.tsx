import { DAppKitProvider } from "@vechain/dapp-kit-react";
import { ChakraProvider, Container, Flex } from "@chakra-ui/react";
import {
  Dropzone,
  Footer,
  InfoCard,
  Instructions,
  Navbar,
  SubmissionModal,
} from "./components";
import { lightTheme } from "./theme";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Submit } from "./submit";
import { Pos } from "./pos";

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar />
    <Flex flex={1}>
      <Container
        mt={{ base: 4, md: 10 }}
        maxW={"container.xl"}
        mb={{ base: 4, md: 10 }}
        display={"flex"}
        flex={1}
        alignItems={"center"}
        justifyContent={"flex-start"}
        flexDirection={"column"}
      >
        <InfoCard />
        <Instructions />
        <Dropzone />
      </Container>
    </Flex>
    <Footer />

    {/* MODALS  */}
    <SubmissionModal /></>,
  },
  {
    path: "/submit",
    element: <div className="flex flex-col"><Navbar /><Submit /></div>
  },
  {
    path: "/pos",
    element: <div className="flex flex-col"><Navbar /><Pos /></div>
  },
  {
    path: '/claim',
    element: <div className="flex flex-col"><Navbar /><Submit /></div>
  }
]);

function App() {
  return (

    <ChakraProvider theme={lightTheme}>
      <DAppKitProvider
        usePersistence
        requireCertificate={false}
        genesis="test"
        nodeUrl="https://testnet.vechain.org/"
        logLevel={"DEBUG"}
      >
          <RouterProvider router={router} />
      </DAppKitProvider>
    </ChakraProvider>
  );
}

export default App;
