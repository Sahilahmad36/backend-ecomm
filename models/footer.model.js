import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const FooterSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    socialLinks: {
      facebook: {
        type: String,
        default: '#',
      },
      instagram: {
        type: String,
        default: '#',
      },
      linkedin: {
        type: String,
        default: '#',
      },
    },
    importantLinks: [linkSchema], // ✅ new field
    moreLinks: [linkSchema],      // ✅ new field
    newsletterText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Footer', FooterSchema);
