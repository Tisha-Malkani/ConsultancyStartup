import { useState, useEffect } from 'react';
import { fetchCaseStudies } from '../api/api.js';
import CaseStudyCard from '../components/CaseStudyCard';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const CaseStudySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <div key={item} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="h-52 bg-slate-200 animate-pulse"></div>
        <div className="p-7">
          <div className="h-3 w-32 bg-slate-100 rounded animate-pulse mb-4"></div>
          <div className="h-7 w-full bg-slate-100 rounded animate-pulse mb-3"></div>
          <div className="h-7 w-3/4 bg-slate-100 rounded animate-pulse mb-6"></div>
          <div className="h-20 bg-emerald-50 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

const BackendFallback = ({ message }) => (
  <div className="bg-white rounded-3xl border border-red-100 shadow-xl p-8 sm:p-10 text-center max-w-2xl mx-auto">
    <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
      <AlertTriangle className="w-7 h-7" />
    </div>
    <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Case studies are temporarily unavailable</h2>
    <p className="text-slate-600 leading-relaxed mb-6">{message}</p>
    <Link to="/contact" className="inline-flex bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700">
      Request sample outcomes
    </Link>
  </div>
);

const CaseStudies = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getCases = async () => {
      try {
        const { data } = await fetchCaseStudies();
        setCases(data);
      } catch (err) {
        setError(err.request
          ? 'The case-study service could not be reached. Please check that the backend is running, or continue exploring the services and contact pages.'
          : 'We could not load case studies right now. Please try again shortly.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getCases();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-slate-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Proven <span className="text-blue-400">ROI</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We don't just deliver slide decks. We deliver measurable, bottom-line impact. Here are the results of our operational interventions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {loading ? (
          <CaseStudySkeleton />
        ) : error ? (
          <BackendFallback message={error} />
        ) : cases.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-lg bg-white rounded-3xl shadow-xl">No case studies are published yet. New success stories will appear here once approved.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cases.map((study) => (
              <CaseStudyCard key={study._id} study={study} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseStudies;
