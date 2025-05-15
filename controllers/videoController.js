import cloudinary from 'cloudinary';
import Video from '../models/Video.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const uploadVideo = async (req, res) => {
  try {
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile || !thumbnailFile) {
      return res.status(400).json({ error: 'Both video and thumbnail are required' });
    }

    const videoUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: 'video', folder: 'videos' },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(videoFile.buffer);
    });

    const thumbnailUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: 'image', folder: 'thumbnails' },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(thumbnailFile.buffer);
    });

    const video = new Video({
      title: req.body.title,
      description: req.body.description,
      videoUrl: videoUpload.secure_url,
      cloudinaryId: videoUpload.public_id,
      thumbnailUrl: thumbnailUpload.secure_url,
    });

    await video.save();
    res.status(200).json({ message: 'Uploaded', video });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    console.error('Fetching videos error:', err);
    res.status(500).json({ error: 'Error fetching videos' });
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.status(200).json(video);
  } catch (err) {
    console.error('Fetching video error:', err);
    res.status(500).json({ error: 'Error fetching video' });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    video.title = req.body.title || video.title;
    video.description = req.body.description || video.description;

    if (req.files?.video?.[0]) {
      await cloudinary.v2.uploader.destroy(video.cloudinaryId, {
        resource_type: 'video',
      });

      const newVideo = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: 'video', folder: 'videos' },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.files.video[0].buffer);
      });

      video.videoUrl = newVideo.secure_url;
      video.cloudinaryId = newVideo.public_id;
    }

    if (req.files?.thumbnail?.[0]) {
      const newThumb = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: 'image', folder: 'thumbnails' },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.files.thumbnail[0].buffer);
      });

      video.thumbnailUrl = newThumb.secure_url;
    }

    await video.save();
    res.status(200).json({ message: 'Video updated successfully', video });
  } catch (err) {
    console.error('Update video error:', err);
    res.status(500).json({ error: 'Error updating video' });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.cloudinaryId) {
      await cloudinary.v2.uploader.destroy(video.cloudinaryId, {
        resource_type: 'video',
      });
    }

    await Video.deleteOne({ _id: video._id });

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error('Server error in deleteVideo:', err.message);
    res.status(500).json({ error: 'Error deleting video', details: err.message });
  }
};

export default {
  uploadVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
};
