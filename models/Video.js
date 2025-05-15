import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    cloudinaryId: { type: String, required: true },
    thumbnailUrl: { type: String },
  },
  { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);

export default Video;
