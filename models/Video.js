
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  src: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  thumbnailUrl: { type: String }, 
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

export default Video;
