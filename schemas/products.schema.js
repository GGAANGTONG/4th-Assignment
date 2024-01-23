import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
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
      enum: ['FOR_SALE', 'SOLD_OUT'],
      default: 'FOR_SALE',
    },
    password: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
