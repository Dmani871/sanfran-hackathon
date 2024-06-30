import { Button } from "@chakra-ui/react"
import axios from "axios";
import { backendURL } from "../config";

export const Pos = () => {

	const onSubmit = async (item: string) => {
		// request to the backend to 
		const response = await axios.post(`${backendURL}/markAsSold`, {
			item,
		});

		return response;
	};

	return (
		<>
		<Button colorScheme='teal' variant='solid' onClick={() => onSubmit("coffee")}>
			Mark coffee as sold
		</Button>
		<Button colorScheme='teal' variant='solid' onClick={() => onSubmit("mountain-dew")}>
			Mark mountain dew
		</Button>
		</>
	)
}