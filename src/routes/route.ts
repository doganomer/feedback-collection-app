import express from 'express';
import sellerController from '../controllers/sellers';
import  fcsController from '../controllers/fcs'
const router = express.Router();

router.get('/sellers', sellerController.getSellers);
router.get('/sellers/:id', sellerController.getSeller);
router.post('/sellers/add', sellerController.registerSeller);

router.post('/feedbacks/add', fcsController.sendFeedback);

export = router;