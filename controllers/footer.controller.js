import Footer from '../models/footer.model.js';


export const getFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    res.json(footer);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching footer', error: err.message });
  }
};


export const createFooter = async (req, res) => {
  try {
    const footer = new Footer(req.body);
    const saved = await footer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating footer', error: err.message });
  }
};


export const updateFooter = async (req, res) => {
  try {
    const existing = await Footer.findOne();
    const updated = existing
      ? await Footer.findByIdAndUpdate(existing._id, req.body, { new: true })
      : await Footer.create(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating footer', error: err.message });
  }
};


export const deleteFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    if (!footer) {
      return res.status(404).json({ message: 'Footer not found' });
    }
    await Footer.findByIdAndDelete(footer._id);
    res.json({ message: 'Footer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting footer', error: err.message });
  }
};
