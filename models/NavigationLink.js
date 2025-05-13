import mongoose from 'mongoose';

const navigationLinkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    }
}, { timestamps: true });

const NavigationLink = mongoose.model('NavigationLink', navigationLinkSchema);

export default NavigationLink;
