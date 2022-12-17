import axios, { AxiosResponse } from 'axios';
import { Request, Response, NextFunction, json, response } from 'express';
import { isIdentifier } from 'typescript';
import ChaincodeManager from '../chaincode-manager';
import { PresentProofModel } from '../model/present-proof-model';

const sendFeedback = async (req: Request, res: Response, next: NextFunction) => {
    const starttime = process.hrtime();

    try {

        let id: string = req.body.id;
        let sellerId: string = req.body.sellerId;
        let score: number = req.body.score;
        let comment: string = req.body.comment;

        // 1- check if appropriate proof exists
        let result: AxiosResponse = await axios.get(`${global.AgentRootUrls.FcsAgentUrl}/present-proof/records?role=verifier&state=verified&connection_id=${global.ConnectionIds.BuyerConnectionIdOnFCS}`);
        let responseData: PresentProofModel = result.data;

        let schemaAndCredDefExists: boolean = false;
        let feedbackTokenId = '';

        if (responseData.results.length > 0) {
            responseData.results.forEach(result => {
                if (result.presentation.identifiers.length > 0) {
                    result.presentation.identifiers.forEach(identifier => {
                        if (identifier.cred_def_id == global.CredDefIds.FeedbackTokenCredDefId && identifier.schema_id == global.SchemaIds.FeedbackTokenSchemaId) {
                            schemaAndCredDefExists = true;
                            feedbackTokenId = result.presentation_exchange_id;
                        }
                    });
                }
            });
        }

        if (!schemaAndCredDefExists) {
            throw new Error(`A valid feedback token should be presented before adding feedback`);
        }

        // 1.a Not exists --> Throw error
        // 1.b Exists --> Call chaincode method

        const cm = new ChaincodeManager();
        await cm.AddFeedback(id, sellerId, score, comment, feedbackTokenId);

        

        return res.status(200).json('Created');
    } catch (error) {
        return res.status(500).json('Error occurred - ' + error);
    } finally {
        const endtime = process.hrtime(starttime);
        console.log('Execution time for sendFeedback (hr): %ds %dms', endtime[0], endtime[1] / 1000000)
    }
}

const getFeedbacks = async (req: Request, res: Response, next: NextFunction) => {

    const cm = new ChaincodeManager();

    let feedbackList;
    await cm.GetAllFeedbacks().then((sl)=> {
        feedbackList = sl;
    });

    return res.status(200).type('application/json').send(feedbackList);
}

export default { sendFeedback, getFeedbacks };
