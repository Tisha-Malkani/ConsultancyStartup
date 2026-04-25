import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ESGCalculator = lazy(() => import('./pages/ESGCalculator'));
const Contact = lazy(() => import('./pages/Contact'));
const Auth = lazy(() => import('./pages/Auth'));
const IndustrySolutions = lazy(() => import('./pages/IndustrySolutions'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Admin = lazy(() => import('./pages/Admin'));

const PageLoader = () => (
  <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 text-slate-500">
      <svg className="animate-spin h-9 w-9 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span className="font-semibold">Loading NovaConsult...</span>
    </div>
  </div>
);

const AdminRoute = ({ children }) => {
  const userInfo = (() => {
    try { return JSON.parse(localStorage.getItem('userInfo')); }
    catch { return null; }
  })();
  return userInfo?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

const ClientRoute = ({ children }) => {
  const userInfo = (() => {
    try { return JSON.parse(localStorage.getItem('userInfo')); }
    catch { return null; }
  })();
  if (!userInfo) return <Navigate to="/auth" />;
  return userInfo.role === 'admin' ? <Navigate to="/admin" /> : children;
};

const META = [
  { match: /^\/$/, title: 'NovaConsult | Supply Chain, Procurement, ESG & Six Sigma Consulting', description: 'NovaConsult helps organizations reduce operating cost, improve supply chain resilience, strengthen suppliers, and meet ESG goals.' },
  { match: /^\/about/, title: 'About NovaConsult | Operational Excellence Consultancy', description: 'Learn about NovaConsult vision, expertise, leadership, and execution-led consulting approach.' },
  { match: /^\/services/, title: 'Services | Supply Chain, Procurement, ESG & Process Excellence', description: 'Explore NovaConsult service portfolio across supply chain management, procurement, vendor development, logistics, inventory, ESG, and Six Sigma.' },
  { match: /^\/industry-solutions/, title: 'Industry Solutions | Manufacturing, FMCG, Pharma & Logistics', description: 'Industry-specific consulting solutions for manufacturing, FMCG, retail, pharma, automotive, and logistics organizations.' },
  { match: /^\/case-studies/, title: 'Case Studies | NovaConsult Success Stories', description: 'Review simulated operational transformation case studies with measurable savings, service, ESG, and process improvement outcomes.' },
  { match: /^\/blogs/, title: 'Insights | NovaConsult Whitepapers and Articles', description: 'Read expert perspectives on supply chain resilience, procurement transformation, ESG compliance, and process excellence.' },
  { match: /^\/esg-calculator/, title: 'ESG ROI Calculator | NovaConsult', description: 'Estimate logistics optimization potential and carbon reduction opportunities using NovaConsult ESG and performance calculator.' },
  { match: /^\/contact/, title: 'Book a Consultation | NovaConsult', description: 'Schedule a consultation with NovaConsult to discuss supply chain, procurement, logistics, Six Sigma, inventory, or ESG challenges.' },
  { match: /^\/dashboard/, title: 'Client Portal | NovaConsult', description: 'Access your NovaConsult client portal with consultation, ESG, supplier, and implementation performance dashboards.' },
  { match: /^\/admin/, title: 'Consultant Admin | NovaConsult', description: 'NovaConsult consultant workspace for managing client engagements, diagnostics, actions, and documents.' },
  { match: /^\/auth/, title: 'Client Login | NovaConsult', description: 'Sign in or create a NovaConsult account to access your client dashboard and saved ESG calculations.' },
  { match: /^\/privacy/, title: 'Privacy Policy | NovaConsult', description: 'Review how NovaConsult handles contact, consultation, account, dashboard, and ESG calculator information.' },
  { match: /^\/terms/, title: 'Terms of Service | NovaConsult', description: 'Review NovaConsult website, calculator, consultation, and client portal terms of service.' },
];

const MetaManager = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = META.find((item) => item.match.test(location.pathname)) || META[0];
    document.title = meta.title;

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', meta.description);
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <MetaManager />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
              <Route path="/esg-calculator" element={<ESGCalculator />} />
              <Route path="/industry-solutions" element={<IndustrySolutions />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              
              {/* Protected Route for Dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <ClientRoute>
                    <Dashboard />
                  </ClientRoute>
                } 
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
