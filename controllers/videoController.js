import cloudinary from 'cloudinary';
import Video from '../models/Video.js';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Upload video to Cloudinary
export const uploadVideo = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'video', folder: 'videos' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Upload failed' });
        }

        const video = new Video({
          title: req.body.title,
          description: req.body.description,
          videoUrl: result.secure_url,
          cloudinaryId: result.public_id,
        });

        await video.save();
        res.status(200).json({ message: 'Uploaded', video });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    console.error('Fetching videos error:', err);
    res.status(500).json({ error: 'Error fetching videos' });
  }
};

// Get a single video by ID
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

// Update a video
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    video.title = req.body.title || video.title;
    video.description = req.body.description || video.description;

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        resource_type: 'video',
        folder: 'videos',
      });

      await cloudinary.v2.uploader.destroy(video.cloudinaryId, {
        resource_type: 'video',
      });

      video.videoUrl = result.secure_url;
      video.cloudinaryId = result.public_id;
    }

    await video.save();
    res.status(200).json({
      message: 'Video updated successfully',
      video,
    });
  } catch (err) {
    console.error('Update video error:', err);
    res.status(500).json({ error: 'Error updating video' });
  }
};

// Delete a video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Attempt to delete from Cloudinary
    if (video.cloudinaryId) {
      try {
        await cloudinary.v2.uploader.destroy(video.cloudinaryId, {
          resource_type: 'video',
        });
      } catch (cloudErr) {
        console.error('Cloudinary deletion error:', cloudErr.message);
        // Optional: return early if Cloudinary deletion is mandatory
      }
    }

    // Delete from MongoDB
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
