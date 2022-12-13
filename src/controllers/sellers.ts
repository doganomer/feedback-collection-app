import axios, { AxiosResponse } from 'axios';
import { Request, Response, NextFunction } from 'express';
import ChaincodeManager from '../chaincode-manager';
import { PresentProofModel } from '../model/present-proof-model';

const getSellers = async (req: Request, res: Response, next: NextFunction) => {

    const cm = new ChaincodeManager();

    let sellerList = '';
    await cm.GetAllSellers().then((sl)=> sellerList = sl);

    return res.status(200).type('application/json').send(sellerList);
}

const getSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let sellerId: string = req.params.id;

        const cm = new ChaincodeManager();
    
        let seller;
        await cm.GetSeller(sellerId).then((sl)=> seller = sl);
    
        return res.status(200).type('application/json').send(seller);    
    } catch (error) {
        return res.status(500).json('Error occurred - ' + error);
    }
    
}

const registerSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let sellerId: string = req.body.id;
        let name: string = req.body.name;
        let url: string = req.body.url;
        let registeredBy: string = req.body.registeredBy ?? null;
    
        // 1- check if appropriate proof exists
        let result: AxiosResponse = await axios.get(`${global.AgentRootUrls.FcsAgentUrl}/present-proof/records?role=verifier&state=verified&connection_id=${global.ConnectionIds.SellerConnectionIdOnFCS}`);
        let responseData: PresentProofModel = result.data;

        let schemaProofDefExists: boolean = false;
        
        if (responseData.results.length > 0) {
            responseData.results.forEach(result => {
                if (result.presentation.identifiers.length > 0) {
                    result.presentation.identifiers.forEach(identifier => {
                        if (identifier.schema_id == global.SchemaIds.SellerIdentitySchemaId) {
                            schemaProofDefExists = true;
                        }
                    });
                }
            });
        }

        if (!schemaProofDefExists) {
            throw new Error(`A valid digital identity should be presented in order to register a Seller to the system`);
        }

        const cm = new ChaincodeManager();
        await cm.CreateSeller(sellerId, name, url, registeredBy);
    
        return res.status(200).json('Created after checking Digital Identity Proof');    
    } catch (error) {
        return res.status(500).json('Error occurred - ' + error);
    }
    
}

export default { getSellers, getSeller, registerSeller };
