import mongoose from 'mongoose';

const featuredItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FeaturedItem = mongoose.model('FeaturedItem', featuredItemSchema);

export default FeaturedItem;
