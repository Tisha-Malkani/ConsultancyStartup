import { Target, Users, Award, Briefcase, ArrowRight, Linkedin, ShieldCheck, FileCheck2, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const leaders = [
    {
      name: 'Arjun Mehta',
      role: 'Founder & Managing Partner',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
      profile: 'Ex-operations transformation leader with 18+ years across FMCG, retail, and industrial supply chains.',
      credentials: ['APICS CSCP', 'Lean Six Sigma Black Belt', 'Network Design & S&OP'],
      linkedin: 'https://www.linkedin.com/',
    },
    {
      name: 'Dr. Naina Iyer',
      role: 'Partner, ESG & Sustainability',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
      profile: 'Sustainability advisor focused on Scope 3 baselining, supplier engagement, and ESG governance.',
      credentials: ['GRI Standards', 'GHG Protocol', 'Sustainable Procurement'],
      linkedin: 'https://www.linkedin.com/',
    },
    {
      name: 'Vikram Rao',
      role: 'Director, Process Excellence',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80',
      profile: 'Manufacturing excellence practitioner specializing in DMAIC, defect reduction, and operating cadence design.',
      credentials: ['Lean Six Sigma MBB', 'Kaizen Facilitation', 'Plant KPI Systems'],
      linkedin: 'https://www.linkedin.com/',
    },
    {
      name: 'Priya Shah',
      role: 'Director, Procurement Transformation',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80',
      profile: 'Procurement and supplier-risk specialist across category strategy, scorecards, and contract governance.',
      credentials: ['CIPS-aligned Sourcing', 'Supplier Risk', 'Spend Analytics'],
      linkedin: 'https://www.linkedin.com/',
    },
  ];

  const proofItems = [
    { icon: <FileCheck2 className="w-6 h-6" />, label: 'Business identity', value: 'NovaConsult Advisory LLP (verification-ready profile)' },
    { icon: <ShieldCheck className="w-6 h-6" />, label: 'Compliance pack', value: 'NDA, proposal, statement of work, and data-handling terms available before engagement' },
    { icon: <MapPin className="w-6 h-6" />, label: 'Registered office', value: 'Unit 1205, Tower A, Business Park, BKC, Mumbai, MH 400051' },
    { icon: <Mail className="w-6 h-6" />, label: 'Commercial contact', value: 'partnerships.novaconsult@gmail.com | +91 (22) 1234-5678' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Driving <span className="text-blue-400">Excellence</span> Across Operations
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We are a premier consultancy firm dedicated to transforming supply chains, embedding sustainability, and digitizing operations for the world's most ambitious organizations.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
            <div>
              <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Credibility & verification</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-5">Built to support enterprise diligence</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                A serious consulting buyer needs more than polished design. NovaConsult presents clear leadership accountability, named capability areas, commercial contact routes, and engagement documentation expectations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {proofItems.map((item) => (
                <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">{item.icon}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{item.label}</div>
                  <p className="text-slate-800 font-semibold leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Vision</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                To be the global catalyst for resilient, sustainable, and technologically advanced operational models. We envision a business landscape where efficiency and environmental responsibility are inextricably linked.
              </p>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 mt-10">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To equip our clients with data-driven strategies, cutting-edge digital tools, and deep industry expertise. We don't just advise; we partner with you to execute transformations that yield measurable, bottom-line impact.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-8 rounded-3xl flex flex-col items-center text-center border border-blue-100 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                <Target className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-slate-900 text-xl mb-2">Strategy</h3>
                <p className="text-slate-600 text-sm">Actionable roadmaps built for scale.</p>
              </div>
              <div className="bg-indigo-50 p-8 rounded-3xl flex flex-col items-center text-center border border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
                <Users className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="font-bold text-slate-900 text-xl mb-2">Partnership</h3>
                <p className="text-slate-600 text-sm">Working seamlessly with your teams.</p>
              </div>
              <div className="bg-emerald-50 p-8 rounded-3xl flex flex-col items-center text-center border border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                <Award className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="font-bold text-slate-900 text-xl mb-2">Excellence</h3>
                <p className="text-slate-600 text-sm">Six Sigma & lean methodologies.</p>
              </div>
              <div className="bg-purple-50 p-8 rounded-3xl flex flex-col items-center text-center border border-purple-100 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                <Briefcase className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="font-bold text-slate-900 text-xl mb-2">Results</h3>
                <p className="text-slate-600 text-sm">Delivering tangible ROI.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Leadership</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Decades of combined experience at the forefront of supply chain management and corporate strategy.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader) => (
              <div key={leader.name} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <img src={leader.image} alt={leader.name} className="w-full h-64 object-cover object-top" />
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-xl font-bold text-slate-900">{leader.name}</h3>
                    <a href={leader.linkedin} target="_blank" rel="noreferrer" aria-label={`${leader.name} LinkedIn profile`} className="text-slate-400 hover:text-blue-600">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="text-blue-600 font-medium mb-4 text-sm">{leader.role}</div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">{leader.profile}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {leader.credentials.map((credential) => (
                      <span key={credential} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                        {credential}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your operations?</h2>
          <p className="text-xl text-blue-100 mb-10">Connect with our team to discuss your strategic challenges.</p>
          <Link to="/contact" className="inline-flex items-center bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-full hover:bg-slate-50 transition-colors shadow-lg">
            Get in Touch <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
