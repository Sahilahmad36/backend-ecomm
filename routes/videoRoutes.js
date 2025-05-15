import express from 'express';
import upload from '../middleware/upload.js';
import {
  uploadVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/upload', adminAuth, upload, uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideo);
router.put('/updatevideo/:id', adminAuth, upload, updateVideo);
router.delete('/deletevideo/:id', adminAuth, deleteVideo);

export default router;
