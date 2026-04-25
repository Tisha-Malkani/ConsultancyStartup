import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
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
    required: true,
    default: 'Consultancy Expert'
  },
  category: {
    type: String,
    required: true,
    enum: ['Supply Chain', 'ESG', 'Procurement', 'Strategy', 'Digital Transformation']
  },
  image: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80'
  },
  readTime: {
    type: String,
    required: true,
    default: '5 min read'
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
