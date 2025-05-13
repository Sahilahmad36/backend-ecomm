
import express from 'express';
import {
    getNavigationLinks,
    createNavigationLink,
    updateNavigationTitle
} from '../controllers/navigationLinkController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', getNavigationLinks);
router.post('/nav', adminAuth, createNavigationLink);
router.put('/navupdate/:id', adminAuth, updateNavigationTitle);

export default router;