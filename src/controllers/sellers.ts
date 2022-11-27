import { Request, Response, NextFunction } from 'express';
import ChaincodeManager from '../chaincode-manager';

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
    
        const cm = new ChaincodeManager();
        await cm.CreateSeller(sellerId, name, url, registeredBy);
    
        return res.status(200).json('Created');    
    } catch (error) {
        return res.status(500).json('Error occurred - ' + error);
    }
    
}

export default { getSellers, getSeller, registerSeller };
