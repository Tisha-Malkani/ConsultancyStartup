import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2 } from 'lucide-react';
import { fetchBlogById } from '../api/api.js';

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getBlog = async () => {
      try {
        const { data } = await fetchBlogById(id);
        setBlog(data);
      } catch (err) {
        setError('Failed to load the article.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getBlog();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-lg">Loading article...</div>;
  }

  if (error || !blog) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500 text-lg">{error || 'Article not found.'}</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/blogs" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all insights
          </Link>
          <div className="mb-6 inline-block bg-blue-600/20 border border-blue-500/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
            {blog.category}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center space-x-6 text-slate-300 font-medium">
            <div className="flex items-center">
              <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white mr-3 font-bold text-sm">
                {blog.author.charAt(0)}
              </span>
              {blog.author}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" /> {blog.readTime}
            </div>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="max-w-5xl mx-auto -mt-12 relative z-20 px-4">
        <img src={blog.image} alt={blog.title} className="w-full h-80 md:h-[500px] object-cover rounded-3xl shadow-2xl" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 text-slate-700 leading-loose">
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6">{paragraph}</p>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
          <div className="font-medium text-slate-900">Share this article:</div>
          <div className="flex space-x-4">
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
