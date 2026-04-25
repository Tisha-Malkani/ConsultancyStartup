import { Link } from 'react-router-dom';

const Footer = () => {
  const services = [
    'Supply Chain Management',
    'Vendor Development',
    'Procurement Strategy',
    'Six Sigma Excellence',
    'Logistics & Distribution',
    'Inventory Management',
    'ESG Advisory',
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-2xl bg-white text-slate-900 grid place-items-center font-black">NC</span>
              <span>
                <span className="text-2xl font-black text-white block leading-none">NovaConsult</span>
                <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-slate-500">Advisory LLP</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-md mb-6 leading-relaxed">
              Operations and supply chain consulting for organizations seeking measurable efficiency gains, cost reduction, supplier resilience, and ESG performance.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <p><span className="text-slate-200 font-semibold">Office:</span> BKC, Mumbai, MH 400051</p>
              <p><span className="text-slate-200 font-semibold">Email:</span> partnerships.novaconsult@gmail.com</p>
              <p><span className="text-slate-200 font-semibold">Phone:</span> +91 (22) 1234-5678</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link to="/services" className="hover:text-blue-400 transition-colors">{service}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/industry-solutions" className="hover:text-blue-400 transition-colors">Industries</Link></li>
              <li><Link to="/case-studies" className="hover:text-blue-400 transition-colors">Case Studies</Link></li>
              <li><Link to="/esg-calculator" className="hover:text-blue-400 transition-colors">ESG Calculator</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Client Dashboard</Link></li>
              <li><Link to="/blogs" className="hover:text-blue-400 transition-colors">Insights & Whitepapers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col lg:flex-row justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} NovaConsult. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>Commercial consulting website</span>
            <span>Simulated case studies</span>
            <span>Operations, Supply Chain & ESG</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
