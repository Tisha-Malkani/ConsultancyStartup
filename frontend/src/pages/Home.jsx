import { ArrowRight, CheckCircle2, Download, FileText, Leaf, PackageCheck, Target, TrendingUp, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { industryPreviewCards } from '../data/industryData.js';

const Home = () => {
  const proofMetrics = [
    { value: '12-18%', label: 'Typical cost-out opportunity identified in logistics and procurement reviews' },
    { value: '90 days', label: 'Roadmap window for first measurable operational improvements' },
    { value: '7', label: 'Specialist service areas across supply chain, ESG, and excellence' },
  ];

  const services = [
    {
      title: 'Supply Chain & Logistics',
      desc: 'Network redesign, control-tower visibility, OTIF improvement, route optimization, and distribution strategy.',
      icon: <Truck className="w-6 h-6" />,
    },
    {
      title: 'Procurement & Vendor Development',
      desc: 'Spend analytics, supplier scorecards, category strategy, risk mapping, and alternate vendor qualification.',
      icon: <PackageCheck className="w-6 h-6" />,
    },
    {
      title: 'Six Sigma & Process Excellence',
      desc: 'DMAIC projects, defect reduction, root-cause analysis, standard work, and measurable productivity gains.',
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: 'ESG & Sustainability Performance',
      desc: 'Scope 3 baselining, sustainable sourcing, supplier audits, and commercially grounded carbon reduction plans.',
      icon: <Leaf className="w-6 h-6" />,
    },
  ];

  const operatingModel = [
    'Board-ready diagnostics with quantified savings cases',
    'Implementation support, not just advisory presentations',
    'Supplier, inventory, ESG, and process data brought into one decision rhythm',
    'Dashboards that make improvement progress visible to leadership',
  ];

  const clientLogos = ['Meridian FMCG', 'Orion Pharma', 'Solaris Auto', 'Cascade Retail', 'NorthBridge Logistics'];

  const methodology = [
    {
      step: 'Diagnose',
      text: 'Map spend, service levels, supplier risk, inventory, and ESG baselines to isolate the value pool.',
    },
    {
      step: 'Design',
      text: 'Build the operating model, improvement roadmap, governance cadence, and savings business case.',
    },
    {
      step: 'Implement',
      text: 'Work with client teams to run pilots, qualify suppliers, improve processes, and embed controls.',
    },
    {
      step: 'Measure',
      text: 'Track impact through dashboards, KPI reviews, benefit realization, and leadership reporting.',
    },
  ];

  const testimonials = [
    {
      quote: 'NovaConsult helped us move from reactive firefighting to a structured operating rhythm. The biggest value was turning supply chain noise into executive decisions.',
      name: 'Ananya Mehta',
      role: 'COO, Meridian Consumer Goods',
    },
    {
      quote: 'The procurement diagnostic gave us a clear category savings case within weeks, with supplier risk and ESG considerations included from day one.',
      name: 'Rohit Menon',
      role: 'Head of Procurement, Orion Pharma',
    },
    {
      quote: 'Their DMAIC approach was practical, data-led, and easy for plant teams to adopt. It felt like implementation support, not a slide-deck exercise.',
      name: 'Kavya Rao',
      role: 'Plant Excellence Lead, Solaris Auto Components',
    },
  ];

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-28 lg:pb-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute inset-y-0 right-0 hidden lg:block w-1/2">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80"
            alt="Warehouse operations and supply chain execution"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/30"></div>
        </div>
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-900 to-transparent z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.82fr] gap-12 items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 text-blue-400 font-medium text-sm mb-8 border border-slate-700 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              Supply Chain, Procurement, Six Sigma & ESG Consulting
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8 leading-tight">
              Reduce operating cost and build a more resilient value chain
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              NovaConsult helps manufacturing, FMCG, pharma, and logistics teams improve OTIF, release working capital, strengthen suppliers, and meet sustainability targets with measurable implementation programmes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center">
                Book a Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/services" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-4 rounded-full font-medium text-lg transition-all shadow-sm flex items-center justify-center">
                Explore Solutions
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              {proofMetrics.map((metric) => (
                <div key={metric.value} className="border-l border-slate-700 pl-4">
                  <div className="text-2xl font-extrabold text-white">{metric.value}</div>
                  <p className="text-sm text-slate-400 mt-1 leading-snug">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 mb-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">Executive value snapshot</p>
                    <h3 className="text-xl font-black text-slate-900 mt-1">90-day opportunity model</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-5">
                  {[
                    { label: 'Logistics cost opportunity', value: '₹1.8 Cr', width: '78%', color: 'bg-blue-600' },
                    { label: 'Working capital release', value: '₹3.4 Cr', width: '86%', color: 'bg-emerald-500' },
                    { label: 'Scope 3 reduction target', value: '22%', width: '64%', color: 'bg-indigo-500' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-bold text-slate-700">{item.label}</span>
                        <span className="font-black text-slate-900">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Cost', 'Service', 'ESG'].map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 text-center">
                    <div className="text-blue-300 text-xs font-black uppercase tracking-wider">{item}</div>
                    <div className="text-white text-lg font-black mt-1">Tracked</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
            <div>
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Commercial outcomes</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-5">Consulting built around measurable operating performance</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                The platform positions NovaConsult as an execution-focused partner for teams that need savings, service reliability, supplier resilience, and ESG compliance to move together.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {operatingModel.map((item) => (
                <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-8">Trusted in simulated transformation programmes across</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {clientLogos.map((logo) => (
              <div key={logo} className="h-20 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-center px-4 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-slate-700 font-black tracking-tight">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="eyebrow">Services portfolio</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">Specialist support across the operating system</h2>
            </div>
            <Link to="/services" className="inline-flex items-center text-slate-900 font-bold hover:text-blue-600">
              View detailed offerings <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.title} className="premium-card rounded-2xl p-7 group">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-400 font-bold uppercase tracking-wider text-sm">Industry-ready</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mt-3 mb-6">Designed for manufacturing, FMCG, pharma, automotive, and logistics teams</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Each engagement connects operational diagnostics with commercial impact: service levels, working capital, category savings, supplier health, and emissions performance.
              </p>
              <Link to="/industry-solutions" className="inline-flex items-center bg-white text-slate-900 px-7 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors">
                Explore industries <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {industryPreviewCards.map((industry) => {
                const Icon = industry.icon;
                return (
                <div key={industry.title} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-6 hover:bg-slate-800 hover:border-blue-500/60 transition-all duration-300">
                  <div className="text-blue-400 mb-4"><Icon className="w-6 h-6" /></div>
                  <h3 className="font-bold text-lg mb-2">{industry.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{industry.text}</p>
                </div>
              )})}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Our methodology</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-5">Diagnose, design, implement, and measure</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Every engagement is structured to move from evidence to execution, with quantified benefits and clear accountability at each stage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {methodology.map((item, index) => (
              <div key={item.step} className="relative premium-card rounded-2xl p-7 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-indigo-500"></div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black mb-6">{index + 1}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.step}</h3>
                <p className="text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-10 items-center">
            <div>
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Proof point</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-5">Simulated case studies with board-level metrics</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                The case-study library demonstrates realistic operational narratives: bottlenecks, intervention strategy, and measurable improvement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/case-studies" className="inline-flex items-center justify-center bg-slate-900 text-white px-7 py-3 rounded-full font-bold hover:bg-slate-800">
                  View case studies <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/esg-calculator" className="inline-flex items-center justify-center border border-slate-300 text-slate-900 px-7 py-3 rounded-full font-bold hover:bg-slate-50">
                  Calculate ESG ROI
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
              <div className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4">Example outcome</div>
              <div className="text-5xl font-black text-emerald-600 mb-3">₹3.4 Cr</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Working capital released through inventory optimization</h3>
              <p className="text-slate-700 leading-relaxed">
                ABC-XYZ segmentation, dynamic safety stock policies, and SKU rationalization reduced excess inventory while protecting service levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Resource library</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">Downloadable whitepapers for operations leaders</h2>
            </div>
            <Link to="/blogs" className="inline-flex items-center text-slate-900 font-bold hover:text-blue-600">
              Browse insights <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whitepapers.map((paper) => (
              <div key={paper.title} className="premium-card rounded-2xl p-7">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{paper.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{paper.desc}</p>
                <a href={paper.href} download className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700">
                  Download brief <Download className="ml-2 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Client voice</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">What transformation sponsors expect from us</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.name} className="premium-card rounded-2xl p-8 flex flex-col">
                <div className="text-5xl font-black text-blue-100 leading-none mb-2">"</div>
                <p className="text-slate-700 leading-relaxed text-lg flex-grow">{item.quote}</p>
                <div className="border-t border-slate-100 pt-5 mt-8">
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-sm text-slate-500 mt-1">{item.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5 relative z-10">Ready to find the savings case inside your operations?</h2>
          <p className="text-slate-300 text-lg mb-9 max-w-2xl mx-auto relative z-10">
            Share your current challenge and receive a structured consultation slot with the next available advisor.
          </p>
          <Link to="/contact" className="inline-flex items-center bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 shadow-lg relative z-10">
            Book a consultation <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
