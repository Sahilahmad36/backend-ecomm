import FeaturedItem from '../models/FeaturedItem.js';

const getFeaturedItems = async (req, res) => {
  try {
    const items = await FeaturedItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFeaturedItem = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newItem = new FeaturedItem({ title, description });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateFeaturedItem = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedItem = await FeaturedItem.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  getFeaturedItems,
  createFeaturedItem,
  updateFeaturedItem,
};
