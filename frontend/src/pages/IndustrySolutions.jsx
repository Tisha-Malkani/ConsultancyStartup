import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { accentClasses, industries } from '../data/industryData.js';

const IndustrySolutions = () => {
  const [activeTab, setActiveTab] = useState('manufacturing');
  const activeData = industries[activeTab];
  const ActiveIcon = activeData.icon;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-slate-950 pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_42%)]" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Industry-Specific <span className="text-blue-400">Engineering</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Operational strategy requires context. See how our methodologies adapt to the specific constraints of your industry.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto -mt-14 relative z-10 px-4">
        <div className="max-w-[1320px] rounded-[28px] border border-slate-200/80 bg-white/95 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur overflow-x-auto">
          <div className="grid min-w-[920px] grid-cols-5 gap-2">
            {Object.values(industries).map((industry) => (
              <button
                key={industry.key}
                onClick={() => setActiveTab(industry.key)}
                className={`inline-flex w-full items-center justify-center py-3.5 px-4 sm:px-5 rounded-2xl font-bold text-sm sm:text-[15px] transition-all ${
                  activeTab === industry.key
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/15'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <industry.icon
                  className={`w-5 h-5 mr-2 ${
                    activeTab === industry.key ? 'text-blue-300' : 'text-slate-400'
                  }`}
                />
                {industry.shortLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        <section className="mb-10 sm:mb-14 rounded-[30px] border border-slate-200 bg-white p-7 sm:p-10 lg:p-12 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                <ActiveIcon className={`w-4 h-4 ${accentClasses[activeData.accent]}`} />
                Active Industry Focus
              </div>
              <h2 className="mt-6 text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-950 tracking-tight">{activeData.title}</h2>
              <p className="mt-4 text-xl text-slate-600 leading-relaxed">{activeData.tagline}</p>
              <p className="mt-5 max-w-3xl text-base sm:text-lg text-slate-500 leading-8">{activeData.summary}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Diagnostics tuned to sector constraints',
                'Cost, service, quality, and risk in one operating view',
                'Transformation programs grounded in measurable KPIs',
                'Commercially realistic delivery for live operations',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${accentClasses[activeData.accent]}`} />
                    <p className="text-sm sm:text-[15px] font-semibold leading-7 text-slate-700">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-14">
          {activeData.metrics.map((metric, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 sm:p-8 rounded-[26px] text-center shadow-sm hover:shadow-lg transition-all">
              <div className={`text-3xl sm:text-4xl font-extrabold mb-2 ${accentClasses[activeData.accent]}`}>
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {activeData.pillars.map((pillar, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-8 rounded-[28px] shadow-sm hover:shadow-xl transition-all duration-300">
              <pillar.icon className={`w-8 h-8 mb-4 ${accentClasses[activeData.accent]}`} />
              <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
              <p className="text-slate-600 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center border-t border-slate-200 pt-12">
          <Link to="/contact" className="inline-flex items-center bg-slate-900 text-white font-bold px-8 py-4 rounded-full hover:bg-slate-800 transition-colors shadow-lg">
            Discuss {activeData.title} Solutions <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndustrySolutions;
