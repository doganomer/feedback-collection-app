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
    BuyerConnectionIdOnFCS: 'd5384b59-90ef-4b7a-981c-96889d11c2cf',
    SellerConnectionIdOnFCS: 'ef13d73f-4306-4594-a37b-679933e71405'
}

global.AgentRootUrls = {
    BuyerAgentUrl: 'http://localhost:5001',
    SellerAgentUrl: 'http://localhost:6001',
    FcsAgentUrl: 'http://localhost:6101',
    TicaretBakanligiAgentUrl: 'http://localhost:6201'
}

global.SchemaIds = {
    SellerIdentitySchemaId : 'NTKxqEWDjZov2Yq9jRZjs3:2:SellerDigitalIdentity:1.0',
    DiscountTokenSchemaId: 'NTKxqEWDjZov2Yq9jRZjs3:2:DiscountToken:1.0',
    FeedbackTokenSchemaId: 'NTKxqEWDjZov2Yq9jRZjs3:2:FeedbackToken:1.0'
}

global.CredDefIds = {
    FeedbackTokenCredDefId: 'RRoXJyEovvY6jra2N6ukho:3:CL:14:default',
    DiscountTokenCredDefId: 'VLUhnGg8ehtJhU1r3LesdM:3:CL:15:default',
    SellerDigitalIdentityCredDefId: 'NTKxqEWDjZov2Yq9jRZjs3:3:CL:12:default'
}

