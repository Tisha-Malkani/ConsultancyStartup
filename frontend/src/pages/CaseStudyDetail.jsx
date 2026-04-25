import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';
import { fetchCaseStudyById } from '../api/api.js';

const CaseStudyDetail = () => {
  const { id } = useParams();
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getStudy = async () => {
      try {
        const { data } = await fetchCaseStudyById(id);
        setStudy(data);
      } catch (err) {
        setError('Could not load this case study.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getStudy();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-lg animate-pulse">Loading case study...</div>
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-lg">{error || 'Case study not found.'}</div>
        <Link to="/case-studies" className="text-blue-600 font-medium hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Case Studies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Banner */}
      <div className="relative h-80 md:h-[420px] overflow-hidden">
        <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 md:pb-16">
          <div className="mb-7">
            <Link
            to="/case-studies"
              className="inline-flex items-center rounded-full border border-white/15 bg-slate-900/45 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 backdrop-blur transition-colors hover:bg-slate-900/60"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> All Case Studies
            </Link>
          </div>
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
              {study.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {study.title}
            </h1>
            <p className="text-blue-400 font-bold mt-3 text-lg">{study.client}</p>
          </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

        {/* Result Highlight Card */}
        <div className="bg-emerald-500 rounded-3xl p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl shadow-emerald-500/30">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-10 h-10 text-white flex-shrink-0" />
            <div>
              <div className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-1">The Quantified Result</div>
              <div className="text-5xl font-black text-white">{study.metric}</div>
            </div>
          </div>
          <div className="text-white font-bold text-xl sm:text-2xl text-right leading-tight max-w-xs">
            {study.metricLabel}
          </div>
        </div>

        {/* Challenge & Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Challenge */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mr-3 flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">The Challenge</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-base">{study.challenge}</p>
          </div>

          {/* Strategy */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center mr-3 flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">The NovaConsult Strategy</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-base">{study.strategy}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Facing a similar challenge?</h3>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Our team has delivered results like these across Manufacturing, FMCG, Pharma, and Automotive. Let's talk about your specific situation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-blue-500/30 text-lg"
            >
              Book a Free Strategy Call <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDetail;
