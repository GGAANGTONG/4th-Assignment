import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
});

export default mongoose.model('Product', productSchema);
