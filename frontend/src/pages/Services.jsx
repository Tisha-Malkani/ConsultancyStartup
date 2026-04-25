import { Package, Leaf, Target, ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const colorClasses = {
    blue: {
      badge: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      dot: 'bg-blue-500',
    },
    cyan: {
      badge: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      dot: 'bg-cyan-500',
    },
    purple: {
      badge: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      dot: 'bg-purple-500',
    },
    orange: {
      badge: 'bg-orange-500/20 border-orange-500/30 text-orange-300',
      dot: 'bg-orange-500',
    },
    amber: {
      badge: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
      dot: 'bg-amber-500',
    },
    indigo: {
      badge: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
      dot: 'bg-indigo-500',
    },
    emerald: {
      badge: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      dot: 'bg-emerald-500',
    },
  };

  const services = [
    {
      id: "scm",
      title: "Supply Chain Management",
      focus: "End-to-End Optimization",
      icon: <Package className="w-8 h-8 text-blue-400" />,
      problem: "Fragmented supply networks and poor visibility lead to severe bottlenecks, inability to scale, and high operational costs.",
      solution: "We re-architect your supply chain network. By implementing digital control towers, we dramatically improve visibility and predictability, building resilience against global shocks.",
      color: "blue",
      offerings: ["End-to-End Network Design", "Digital Control Tower Setup", "Supply Chain Risk Modeling", "S&OP Alignment"]
    },
    {
      id: "logistics",
      title: "Logistics & Distribution",
      focus: "Network Efficiency",
      icon: <Package className="w-8 h-8 text-cyan-400" />,
      problem: "Erratic lead times, poor routing, and high freight costs cause missed deliveries and push OTIF rates below industry benchmarks.",
      solution: "We consolidate carrier networks and optimize distribution nodes, pushing OTIF rates into the 95th percentile while reducing transportation spend.",
      color: "cyan",
      offerings: ["Freight & Carrier Consolidation", "Route Optimization", "Distribution Center Layout", "Last-Mile Strategy"]
    },
    {
      id: "procurement",
      title: "Procurement & Purchase Strategy",
      focus: "Strategic Sourcing",
      icon: <Target className="w-8 h-8 text-purple-400" />,
      problem: "Tactical, decentralized purchasing leading to rogue spending, lack of leverage in negotiations, and inability to capture enterprise-wide economies of scale.",
      solution: "We digitally transform the procure-to-pay lifecycle. We deploy AI-driven spend analytics to consolidate spend and shift purchasing from a cost-center to a value-driver.",
      color: "purple",
      offerings: ["Spend Analytics & Categorization", "Contract Lifecycle Management", "Category Strategy Development", "E-Sourcing & Auctions"]
    },
    {
      id: "vendor",
      title: "Vendor Development",
      focus: "Supplier Risk & Capacity",
      icon: <CheckCircle2 className="w-8 h-8 text-orange-400" />,
      problem: "High dependency on a fragile supplier base, lack of visibility into Tier 2 constraints, and frequent disruptions due to supplier bankruptcy or capacity limits.",
      solution: "We establish robust supplier scorecards and capacity-building programs, helping you actively develop critical vendors into strategic, high-performing partners.",
      color: "orange",
      offerings: ["Supplier Risk Assessments", "Capacity Building Programs", "Nearshoring Strategies", "Vendor Performance Scorecards"]
    },
    {
      id: "inventory",
      title: "Inventory Management",
      focus: "Working Capital Optimization",
      icon: <Package className="w-8 h-8 text-amber-400" />,
      problem: "Trapped working capital due to massive safety stock holding, simultaneously plagued by frequent stockouts of high-velocity SKUs due to poor demand forecasting.",
      solution: "We deploy advanced predictive analytics to right-size your inventory. We balance service levels against carrying costs, freeing up millions in cash flow.",
      color: "amber",
      offerings: ["Demand Forecasting & Planning", "Safety Stock Optimization", "SKU Rationalization", "Working Capital Release"]
    },
    {
      id: "sixsigma",
      title: "Six Sigma & Process Excellence",
      focus: "DMAIC & Zero-Defect",
      icon: <Target className="w-8 h-8 text-indigo-400" />,
      problem: "Process variances, high rework rates, and operational bottlenecks that erode margins. Legacy systems prevent scaling without proportional cost increases.",
      solution: "Deployment of rigorous DMAIC methodologies. We root out waste, standardize workflows, and embed a culture of continuous, data-driven zero-defect manufacturing.",
      color: "indigo",
      offerings: ["DMAIC Process Improvement", "Lean Manufacturing Implementation", "Root Cause Analysis", "Quality Control Frameworks"]
    },
    {
      id: "esg",
      title: "ESG Integration",
      focus: "Scope 3 Reporting",
      icon: <Leaf className="w-8 h-8 text-emerald-400" />,
      problem: "Impending regulatory pressures (e.g., EU CSRD) and a lack of visibility into Tier 2 and Tier 3 suppliers. Inability to accurately measure Scope 3 emissions.",
      solution: "Comprehensive mapping of your value chain to establish a defensible carbon baseline. We implement automated data collection and sustainable sourcing strategies.",
      color: "emerald",
      offerings: ["Scope 3 Carbon Accounting", "Sustainable Sourcing Strategies", "CSRD Compliance Reporting", "Supplier Audits"]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-slate-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Services <span className="text-blue-400">Portfolio</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We do not offer generic consulting. We deploy highly specialized, problem-solution frameworks designed to resolve your most critical operational bottlenecks.
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-8 sm:space-y-12">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 flex flex-col md:flex-row">
            {/* Title Block */}
            <div className={`bg-slate-900 p-8 md:p-10 md:w-1/3 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-700 relative overflow-hidden`}>
               <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                 {service.icon}
               </div>
               <div className="mb-4">{service.icon}</div>
               <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{service.title}</h2>
               <div className={`inline-block px-3 py-1 rounded-full border text-xs sm:text-sm font-bold uppercase tracking-wider self-start mt-4 ${colorClasses[service.color].badge}`}>
                 Focus: {service.focus}
               </div>
            </div>

            {/* Problem / Solution Block */}
            <div className="p-10 md:w-2/3 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">The Challenge</h3>
                </div>
                <p className="text-slate-600 leading-relaxed pl-7">{service.problem}</p>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">NovaConsult Solution</h3>
                </div>
                <p className="text-slate-600 leading-relaxed pl-7">{service.solution}</p>
              </div>

              {/* Detailed Offerings */}
              <div className="mt-8 pl-7">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Detailed Offerings</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.offerings.map((offering, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-700">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 flex-shrink-0 ${colorClasses[service.color].dot}`}></div>
                      {offering}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8 pl-7">
                 <Link to="/contact" className="text-slate-900 font-bold flex items-center hover:text-blue-600 transition-colors">
                  Discuss this approach <ArrowRight className="ml-2 w-5 h-5" />
                 </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
