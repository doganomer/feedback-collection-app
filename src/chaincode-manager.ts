import { Contract, Gateway, GatewayOptions, Identity, Network, Wallet, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';
import LoggerFactory from './logger-factory';
import { error } from 'winston';

const channelName = 'reputation-channel';
const walletPath = path.join('../vars/profiles/vscode/wallets', 'ticaret.gov.tr');
const ccpPath = path.join('../vars/profiles', 'reputation-channel_connection_for_nodesdk.json');
const chaincodeName = 'fcs';

class ChaincodeManager {

    private readonly _logger = LoggerFactory.getInstance().logger;

    // private static _chaincode: Contract;

    //private _gateway: Gateway;

    //private _chaincodePromise: Promise<void> | null;

    constructor() {
        //this._chaincodePromise = null;
    }


    public async GetAllSellers() {
        // await this.ConnectToChaincode();

        let result = ''; //await ChaincodeManager._chaincode.evaluateTransaction('GetAllSellers');

        // //return prettyJSONString(result.toString());
        return result.toString();
    }

    public async GetSeller(id: string) {
        const starttime = process.hrtime();

        try {

            let result = await this.RunChaincodeMethod(false, 'ReadSeller', id);
            console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            return result;

        } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
        } finally {
            const endtime = process.hrtime(starttime);
            console.log('Execution time for GetSeller (hr): %ds %dms', endtime[0], endtime[1] / 1000000)
        }
    }

    public async CreateSeller(id: string, Name: string, Url: string, RegisteredBy: string) {
        const starttime = process.hrtime();

        try {

            let result = await this.RunChaincodeMethod(true, 'CreateSeller', id, Name, Url, RegisteredBy, new Date().toString());
            //console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            return result;

        } catch (error) {
            console.error(`******** FAILED CreateSeller Method in chaincode-manager: ${error}`);
        } finally {
            const endtime = process.hrtime(starttime);
            console.log('Execution time for CreateSeller (hr): %ds %dms', endtime[0], endtime[1] / 1000000)
        }
    }

    public async AddFeedback(ID: string, SellerId: string, Score: number, Comment: string, FeedbackTokenId: string) {
        const starttime = process.hrtime();

        try {

            let result = await this.RunChaincodeMethod(true, 'AddFeedback', ID, SellerId, Score.toString(), Comment, FeedbackTokenId);

            //Prevent usage of the same feedback twice

            //console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            return result;

        } catch (error) {
            console.error(`******** FAILED AddFeedback Method in chaincode-manager: ${error}`);
        } finally {
            const endtime = process.hrtime(starttime);
            console.log('Execution time for AddFeedback (hr): %ds %dms', endtime[0], endtime[1] / 1000000)
        }
    }



    private async RunChaincodeMethod(isSubmit: boolean, methodName: string, ...args: string[]) {
        try {

            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            const identity = await wallet.get('Admin');
            if (!identity) {
                console.log('Admin identity can not be found in the wallet');
                return;
            }

            const gateway = new Gateway();

            const gatewayOpts: GatewayOptions = {
                wallet,
                identity: 'Admin',
                discovery: { enabled: true, asLocalhost: false },
            };

            try {
                await gateway.connect(ccp, gatewayOpts);

                const network = await gateway.getNetwork(channelName);

                const contract = network.getContract(chaincodeName);

                if (isSubmit) {
                    await contract.submitTransaction(methodName, ...args);
                } else {
                    let result = await contract.evaluateTransaction(methodName, ...args);
                    return result;
                }

            } finally {
                // Disconnect from the gateway when the application is closing
                // This will close all connections to the network
                gateway.disconnect();
            }
        } catch (error) {
            console.error(`******** FAILED RunChaincodeMethod: ${error}`);
            throw error;
        } finally {

        }
    }

}

const prettyJSONString = (inputString: string): string => {
    if (inputString) {
        return JSON.stringify(JSON.parse(inputString), null, 2);
    } else {
        return inputString;
    }
};

export default ChaincodeManager;