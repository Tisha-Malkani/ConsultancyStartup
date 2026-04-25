import { useState } from 'react';
import { Factory, ShoppingBag, ArrowRight, Settings, BarChart2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndustrySolutions = () => {
  const [activeTab, setActiveTab] = useState('manufacturing');

  const industries = {
    manufacturing: {
      title: "Manufacturing Sector",
      icon: <Factory className="w-5 h-5 mr-2" />,
      tagline: "Building resilient, zero-defect production networks.",
      metrics: [
        { label: "Average OTIF Improvement", value: "+22%" },
        { label: "Defect Reduction", value: "85%" },
        { label: "Supply Chain Cost Savings", value: "14%" }
      ],
      pillars: [
        { icon: <Settings className="w-8 h-8 text-blue-500 mb-4" />, title: "Lean Six Sigma Integration", desc: "We embed DMAIC methodologies directly onto the factory floor to eliminate variances and reduce scrap rates." },
        { icon: <ShieldAlert className="w-8 h-8 text-blue-500 mb-4" />, title: "Tier-N Supplier De-risking", desc: "Visibility beyond Tier 1. We map your extended supply chain to identify single points of failure before they disrupt production." },
        { icon: <BarChart2 className="w-8 h-8 text-blue-500 mb-4" />, title: "Scope 3 Decarbonization", desc: "Auditing raw material sourcing to establish carbon baselines and executing strategies to meet tightening industrial regulations." }
      ]
    },
    fmcg: {
      title: "FMCG & Retail",
      icon: <ShoppingBag className="w-5 h-5 mr-2" />,
      tagline: "Agile, demand-driven networks for fast-moving markets.",
      metrics: [
        { label: "Inventory Holding Reduction", value: "18%" },
        { label: "Forecast Accuracy Improvement", value: "+30%" },
        { label: "Carbon Footprint Reduction", value: "25%" }
      ],
      pillars: [
        { icon: <BarChart2 className="w-8 h-8 text-indigo-500 mb-4" />, title: "Demand-Driven Replenishment", desc: "Moving from push to pull. We leverage predictive analytics to align production and distribution exactly with consumer demand." },
        { icon: <Settings className="w-8 h-8 text-indigo-500 mb-4" />, title: "Omnichannel Logistics Optimization", desc: "Consolidating DC networks and optimizing last-mile delivery routes to maintain margin in an omnichannel retail environment." },
        { icon: <ShieldAlert className="w-8 h-8 text-indigo-500 mb-4" />, title: "Sustainable Packaging & Sourcing", desc: "Revamping procurement strategies to prioritize sustainable materials without sacrificing unit economics or compliance." }
      ]
    }
  };

  const activeData = industries[activeTab];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-slate-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Industry-Specific <span className="text-blue-400">Engineering</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Operational strategy requires context. See how our methodologies adapt to the specific constraints of your industry.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-2xl mx-auto -mt-8 relative z-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('manufacturing')}
            className={`flex-1 flex items-center justify-center py-3 sm:py-4 px-4 rounded-xl font-bold text-sm sm:text-base transition-all ${activeTab === 'manufacturing' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {industries.manufacturing.icon} Manufacturing
          </button>
          <button
            onClick={() => setActiveTab('fmcg')}
            className={`flex-1 flex items-center justify-center py-3 sm:py-4 px-4 rounded-xl font-bold text-sm sm:text-base transition-all ${activeTab === 'fmcg' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {industries.fmcg.icon} FMCG & Retail
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{activeData.title}</h2>
          <p className="text-lg text-slate-500">{activeData.tagline}</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-14">
          {activeData.metrics.map((metric, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl text-center shadow-sm">
              <div className={`text-3xl sm:text-4xl font-extrabold mb-2 ${activeTab === 'manufacturing' ? 'text-blue-600' : 'text-indigo-600'}`}>
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {activeData.pillars.map((pillar, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
              {pillar.icon}
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
