import { ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const CaseStudyCard = ({ study }) => {
  return (
    <Link
      to={`/case-studies/${study._id}`}
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="h-52 overflow-hidden relative flex-shrink-0">
        <img src={study.image} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full text-white">
          {study.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-grow">
        <div className="text-blue-600 font-bold tracking-wide uppercase text-xs mb-2">{study.client}</div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors flex-grow">
          {study.title}
        </h3>

        {/* Result pill */}
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 mb-6">
          <TrendingUp className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <div className="text-2xl font-black text-emerald-600 leading-none">{study.metric}</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{study.metricLabel}</div>
          </div>
        </div>

        <div className="flex items-center text-slate-900 font-bold group-hover:text-blue-600 transition-colors border-t border-slate-100 pt-5">
          View Full Case Study <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CaseStudyCard;
