import express from 'express';
import {
  createDonation,
  getAllDonations,
  getDonationById,
  deleteDonation
} from '../controllers/donationController.js';

const router = express.Router();

router.post('/donate', createDonation);
router.get('/donations', getAllDonations);
router.get('/donations/:id', getDonationById);
router.delete('/donations/:id', deleteDonation);

export default router;
