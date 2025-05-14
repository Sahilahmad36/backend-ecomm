// controllers/videoController.js

import Video from '../models/Video.js';
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

// GET all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create video
export const createVideo = async (req, res) => {
  try {
    const { src, title, description } = req.body;
    let thumbnailUrl = '';

    // Check if thumbnail file exists
    if (req.file) {
      console.log('Uploading thumbnail:', req.file.path);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "video-thumbnails"
      });
      thumbnailUrl = result.secure_url;

      // Clean up local file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete local file:', err);
      });
    }

    const newVideo = new Video({
      src,
      title,
      description,
      thumbnailUrl,
    });

    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT update video
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedVideo = await Video.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedVideo) return res.status(404).json({ message: 'Video not found' });

    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE video
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVideo = await Video.findByIdAndDelete(id);
    if (!deletedVideo) return res.status(404).json({ message: 'Video not found' });

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
