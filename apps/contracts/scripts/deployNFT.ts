import { updateConfig, config } from '@repo/config-contract';
import { ethers } from 'hardhat';

type ItemType = {
	name: string;
	price: number;
	quantity: number;
}[];

type ReceiptType = {
	receiptId: string;
	date: string;
	items: ItemType;
};

async function deployMugshot() {
    const [owner] = await ethers.getSigners();

    const nft = await ethers.getContractFactory('Receipt');

    // add the QmcjzEPSQEgrbjvrmVuE91iF1Z5ctve5U7j4gJY7FqwwSD ipfs to the metadata

    const data: ReceiptType = {
        receiptId: "12345",
        date: "2024-06-29",
        items: [
          { name: "Item 1", price: 50.00, quantity: 2},
          { name: "Item 2", price: 50.00, quantity: 1},
        ]
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    const x = await import('kubo-rpc-client');   

    const client = x.create();

    const { cid } = await client.add(blob);

    console.log(`${cid} IT WORKED!!`);

    const url = `ipfs://${cid}`;

    // const result = await fetch(`https://ipfs.io/ipfs/${cid}`);

    // request teh resource
    // const retrived = await result.json();

    // console.log(`${JSON.stringify(retrived, null, 2)} RETRIEVED!!`);

    // const metadata = await client.storeBlob(encoded);

    const nftInstance = await nft.deploy(owner.address);

    await nftInstance.waitForDeployment();

    const nftAddress = await nftInstance.getAddress();


    console.log(`EcoEarn deployed to: ${nftAddress}`);

    const minted = await nftInstance.safeMint(owner.address, url);

    const receipt = await minted.wait();

    console.log(`${receipt?.hash} minted to ${owner.address} with url ${url}`);

		

    // await updateConfig({
    //     ...config,
    //     CONTRACT_ADDRESS: nftAddress,
    // });
}

deployMugshot()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
