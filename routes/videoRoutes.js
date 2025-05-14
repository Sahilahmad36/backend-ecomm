import express from 'express';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController.js';

const router = express.Router();

router.get('/', getAllVideos);
router.post('/addvideo',adminAuth, upload.single('thumbnail'), createVideo);
router.put('/updatevideo/:id',adminAuth, updateVideo);
router.delete('/deletevideo/:id',adminAuth, deleteVideo);

export default router;
