import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Clock, Download, FileText } from 'lucide-react';
import { fetchBlogs } from '../api/api.js';

const whitepapers = [
  {
    title: 'Supply Chain Cost-Out Playbook',
    desc: 'A practical guide to logistics savings, service-level improvement, and network redesign.',
    href: '/whitepapers/supply-chain-cost-out-playbook.md',
  },
  {
    title: 'Scope 3 Readiness Checklist',
    desc: 'Supplier data, emissions baselining, and governance steps for ESG reporting readiness.',
    href: '/whitepapers/scope-3-readiness-checklist.md',
  },
  {
    title: 'Procurement Transformation Brief',
    desc: 'How to structure spend analytics, category strategy, supplier scorecards, and savings tracking.',
    href: '/whitepapers/procurement-transformation-brief.md',
  },
];

const BlogSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {[1, 2, 3].map((item) => (
      <div key={item} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="h-56 bg-slate-200 animate-pulse"></div>
        <div className="p-8">
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse mb-5"></div>
          <div className="h-7 w-full bg-slate-100 rounded animate-pulse mb-3"></div>
          <div className="h-7 w-3/4 bg-slate-100 rounded animate-pulse mb-5"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-100 rounded animate-pulse"></div>
            <div className="h-3 w-11/12 bg-slate-100 rounded animate-pulse"></div>
            <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const InsightsFallback = ({ message }) => (
  <div className="bg-white rounded-3xl border border-red-100 shadow-xl p-8 sm:p-10 text-center max-w-2xl mx-auto">
    <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
      <AlertTriangle className="w-7 h-7" />
    </div>
    <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Insights are temporarily unavailable</h2>
    <p className="text-slate-600 leading-relaxed mb-6">{message}</p>
    <Link to="/contact" className="inline-flex bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700">
      Ask for resources
    </Link>
  </div>
);

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const { data } = await fetchBlogs();
        setBlogs(data);
      } catch (err) {
        setError(err.request
          ? 'The insights service could not be reached. Please check that the backend is running, or download the homepage whitepapers meanwhile.'
          : 'We could not load insights right now. Please try again shortly.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-slate-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Strategic <span className="text-blue-400">Insights</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Expert perspectives, whitepapers, and practical playbooks on supply chain resilience, ESG strategy, procurement, and process excellence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-16">
        <section className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div>
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Featured whitepapers</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Download practical operating briefs</h2>
            </div>
            <Link to="/contact" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700">
              Request a custom diagnostic <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {whitepapers.map((paper) => (
              <div key={paper.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-3">{paper.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">{paper.desc}</p>
                <a href={paper.href} download className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 text-sm">
                  Download brief <Download className="ml-2 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8">
            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Latest articles</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Analysis and perspectives</h2>
          </div>
        {loading ? (
          <BlogSkeleton />
        ) : error ? (
          <InsightsFallback message={error} />
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-lg bg-white rounded-3xl shadow-xl">No insights are published yet. Whitepapers and articles will appear here once approved.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                <div className="h-56 overflow-hidden relative">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold rounded-full text-blue-600 uppercase tracking-wider shadow-sm">
                    {blog.category}
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center text-sm text-slate-500 mb-4 font-medium">
                    <Clock className="w-4 h-4 mr-1.5" /> {blog.readTime}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                    <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-slate-600 mb-6 flex-grow line-clamp-3">
                    {blog.content}
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-auto">
                    <div className="text-sm font-semibold text-slate-900">{blog.author}</div>
                    <Link to={`/blogs/${blog._id}`} className="text-blue-600 font-bold flex items-center hover:text-blue-700">
                      Read more <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </section>
      </div>
    </div>
  );
};

export default Blogs;
