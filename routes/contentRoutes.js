import express from 'express';
import contentController from '../controllers/contentController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', contentController.getAllContent);
router.post('/addcontent', adminAuth, contentController.createContent);
router.put('/updatecontent/:id',adminAuth, contentController.updateContent);

export default router;
