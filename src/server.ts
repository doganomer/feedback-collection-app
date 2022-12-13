import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './routes/route';
import ChaincodeManager from './chaincode-manager';
import LoggerFactory from './logger-factory';
import { Gateway } from 'fabric-network';

let gw: Gateway = null;

process.on('exit', function () {
    console.log('About to exit.');

    if (gw) {
        gw.disconnect();
        console.log('Gateway disconnected.');
    }

  });

const router: Express = express();

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
router.use('/', routes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6070;

LoggerFactory.getInstance().logger.info(`Server created`)

httpServer.listen(PORT, () => LoggerFactory.getInstance().logger.info(`Server is running on port ${PORT}`));

// Set Values of Global Variables
global.ConnectionIds = {
    BuyerConnectionIdOnFCS: 'f09ce6a2-7428-4ad5-91fe-9c7276b9fa3b',
    SellerConnectionIdOnFCS: 'c382716b-6cd2-46cd-9ff2-dfabcaedf84d'
}

global.AgentRootUrls = {
    BuyerAgentUrl: 'http://kimlik.switzerlandnorth.cloudapp.azure.com:5001',
    SellerAgentUrl: 'http://kimlik.switzerlandnorth.cloudapp.azure.com:6001',
    FcsAgentUrl: 'http://kimlik.switzerlandnorth.cloudapp.azure.com:6101',
    TicaretBakanligiAgentUrl: 'http://kimlik.switzerlandnorth.cloudapp.azure.com:6201'
}

global.SchemaIds = {
    SellerIdentitySchemaId : 'NTKxqEWDjZov2Yq9jRZjs3:2:SellerDigitalIdentity:1.0',
    DiscountTokenSchemaId: 'NTKxqEWDjZov2Yq9jRZjs3:2:DiscountToken:1.0',
    FeedbackTokenSchemaId: 'NTKxqEWDjZov2Yq9jRZjs3:2:FeedbackToken:1.0'
}

global.CredDefIds = {
    FeedbackTokenCredDefId: 'RRoXJyEovvY6jra2N6ukho:3:CL:14:default',
    DiscountTokenCredDefId: 'VLUhnGg8ehtJhU1r3LesdM:3:CL:16:default',
    SellerDigitalIdentityCredDefId: 'NTKxqEWDjZov2Yq9jRZjs3:3:CL:12:default'
}

