import express from 'express';
import featuredItemController from '../controllers/featuredItemController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', featuredItemController.getFeaturedItems);
router.post('/addfeature',adminAuth, featuredItemController.createFeaturedItem);
router.put('/updatefeature/:id',adminAuth, featuredItemController.updateFeaturedItem);

export default router;
