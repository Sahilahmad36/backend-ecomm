import NavigationLink from '../models/NavigationLink.js';

export const getNavigationLinks = async (req, res) => {
    try {
        const links = await NavigationLink.find();
        res.status(200).json(links);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createNavigationLink = async (req, res) => {
    const { title, path } = req.body;

    try {
        const newLink = new NavigationLink({ title, path });
        await newLink.save();
        res.status(201).json(newLink);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateNavigationTitle = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const updatedLink = await NavigationLink.findByIdAndUpdate(
            id,
            { title },
            { new: true, runValidators: true }
        );
        if (!updatedLink) return res.status(404).json({ message: 'Link not found' });

        res.status(200).json(updatedLink);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
