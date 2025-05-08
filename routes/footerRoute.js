import express from 'express';
import {
  getFooter,
  createFooter,
  updateFooter,
  deleteFooter
} from '../controllers/footer.controller.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', getFooter);
router.post('/addsection', adminAuth, createFooter);
router.put('/updatesection', adminAuth, updateFooter);
router.delete('/deletesection', adminAuth, deleteFooter);

export default router;
