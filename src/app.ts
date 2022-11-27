/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Gateway, GatewayOptions, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

const channelName = 'reputation-channel';
const chaincodeName = 'fcs';
const walletPath = path.join('../vars/profiles/vscode/wallets', 'ticaret.gov.tr');
const ccpPath = path.resolve(__dirname, '.', 'reputation-channel_connection_for_nodesdk.json');
//const walletPath = path.join(__dirname, 'wallet');


/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */
async function main() {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        
        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('Admin');
        if (! identity) {
            console.log('Admin identity can not be found in the wallet');
            return;
        }

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();

        const gatewayOpts: GatewayOptions = {
            wallet,
            identity: 'Admin',
            discovery: { enabled: true, asLocalhost: false }, // using asLocalhost as this gateway is using a fabric network deployed locally
        };

        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.
            await gateway.connect(ccp, gatewayOpts);

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);

            // Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
            // This type of transaction would only be run once by an application the first time it was started after it
            // deployed the first time. Any updates to the chaincode deployed later would likely not need to run
            // an "init" type function.
            // console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
            // await contract.submitTransaction('InitLedger');
            // console.log('*** Result: committed');

            // Let's try a query type operation (function).
            // This will be sent to just one peer and the results will be shown.
            console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
            let result = await contract.evaluateTransaction('GetAllSellers');
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            // Now let's try to submit a transaction.
            // This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
            // to the orderer to be committed by each of the peer's to the channel ledger.
            // console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments');
            // await contract.submitTransaction('CreateAsset', 'asset13', 'yellow', '5', 'Tom', '1300');
            // console.log('*** Result: committed');

            // console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
            // result = await contract.evaluateTransaction('ReadAsset', 'asset13');
            // console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            // console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
            // result = await contract.evaluateTransaction('AssetExists', 'asset1');
            // console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            // console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
            // await contract.submitTransaction('UpdateAsset', 'asset1', 'blue', '5', 'Tomoko', '350');
            // console.log('*** Result: committed');

            // console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
            // result = await contract.evaluateTransaction('ReadAsset', 'asset1');
            // console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            // try {
            //     // How about we try a transactions where the executing chaincode throws an error
            //     // Notice how the submitTransaction will throw an error containing the error thrown by the chaincode
            //     console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');
            //     await contract.submitTransaction('UpdateAsset', 'asset70', 'blue', '5', 'Tomoko', '300');
            //     console.log('******** FAILED to return an error');
            // } catch (error) {
            //     console.log(`*** Successfully caught the error: \n    ${error}`);
            // }

            // console.log('\n--> Submit Transaction: TransferAsset asset1, transfer to new owner of Tom');
            // await contract.submitTransaction('TransferAsset', 'asset1', 'Tom');
            // console.log('*** Result: committed');

            // console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
            // result = await contract.evaluateTransaction('ReadAsset', 'asset1');
            // console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}

const prettyJSONString = (inputString: string): string => {
    if (inputString) {
         return JSON.stringify(JSON.parse(inputString), null, 2);
    } else {
         return inputString;
    }
};

main();
