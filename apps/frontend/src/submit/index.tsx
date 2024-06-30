import { Input, Table } from "@chakra-ui/react";
import { Dropzone } from "../components";

export const Submit = () => {
	const queryParam = new URLSearchParams(window.location.search);

	const item = queryParam.get('item')

	return (
		<div style={{ fontSize: "2em"}}>
			<h1>
				Your receipt:
			</h1>
			<Table style={{ margin: "2em"}}>
				<tr>
					<th>Item</th>
					<th>Price</th>
					<th>Quantity</th>
				</tr>
				<tr>
					<td>{item}</td>
					<td>10.00</td>
					<td>1</td>
				</tr>
			</Table>
			<Dropzone />
		</div>
	);
};