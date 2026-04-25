import { useState, useEffect } from 'react';
import {
  BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  DollarSign, TrendingUp, Leaf, Briefcase,
  CheckCircle2, Clock, ChevronRight, LogOut, ArrowRight, AlertTriangle, ClipboardList, Activity, CalendarDays, FileText, ShieldCheck
} from 'lucide-react';
import { fetchAnalytics, fetchMyEngagement } from '../api/api.js';
import { Link, useNavigate } from 'react-router-dom';

const PIE_COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const KPI_COLOR_CLASSES = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  teal: 'bg-teal-50 text-teal-600',
};

const DMAIC = [
  { name: 'Define',  progress: 100, status: 'Complete' },
  { name: 'Measure', progress: 100, status: 'Complete' },
  { name: 'Analyze', progress: 65,  status: 'In Progress' },
  { name: 'Improve', progress: 0,   status: 'Pending' },
  { name: 'Control', progress: 0,   status: 'Pending' },
];

const WORKSTREAMS = [
  { name: 'Supply Chain Diagnostic', owner: 'NovaConsult + Operations', status: 'Active', progress: 72, due: '14 May 2026' },
  { name: 'Supplier Risk Scorecard', owner: 'Procurement Lead', status: 'In Review', progress: 54, due: '21 May 2026' },
  { name: 'ESG Baseline Model', owner: 'Sustainability Lead', status: 'Awaiting Data', progress: 38, due: '28 May 2026' },
];

const ACTIONS = [
  { task: 'Upload top 50 supplier spend file', owner: 'Client Procurement', due: '29 Apr', priority: 'High' },
  { task: 'Validate logistics lane baseline', owner: 'Operations PMO', due: '02 May', priority: 'Medium' },
  { task: 'Confirm ESG emission-factor assumptions', owner: 'Sustainability', due: '06 May', priority: 'Medium' },
];

const DOCUMENTS = [
  { title: 'Statement of Work', type: 'Commercial', status: 'Signed' },
  { title: 'Baseline Data Request', type: 'Data Pack', status: 'Open' },
  { title: 'Week 1 Steering Notes', type: 'Governance', status: 'Published' },
];

const parseMoneyString = (value) => {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return 0;

  const trimmed = value.trim();
  const numeric = parseFloat(trimmed.replace(/[$,]/g, ''));

  if (Number.isNaN(numeric)) return 0;
  if (trimmed.includes('M')) return numeric * 1e6;
  if (trimmed.includes('K') || trimmed.includes('k')) return numeric * 1e3;
  return numeric;
};

const parseTonsString = (value) => {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return 0;
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
  return Number.isNaN(numeric) ? 0 : numeric;
};

const getSeverityClasses = (value) => {
  const normalized = String(value || '').toLowerCase();

  if (normalized.includes('high')) return 'bg-red-50 text-red-700 border-red-100';
  if (normalized.includes('medium')) return 'bg-amber-50 text-amber-700 border-amber-100';
  if (normalized.includes('low')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  return 'bg-blue-50 text-blue-700 border-blue-100';
};

const buildDiagnosticIntelligence = ({ data, activeDiagnostic, hasBookings, hasESG }) => {
  const leadService = data.bookingsByService?.[0]?.name || data.recentBookings?.[0]?.interestArea || '';
  const serviceLabel = leadService || activeDiagnostic.recommendedService;
  const normalizedService = serviceLabel.toLowerCase();

  const totalSavingsValue = parseMoneyString(data.kpis.totalESGSavings);
  const totalCarbonValue = parseTonsString(data.kpis.totalCarbonReduced);
  const latestESGRun = hasESG ? data.esgTrend[data.esgTrend.length - 1] : null;
  const latestSavingsValue = latestESGRun?.savings || 0;
  const latestCarbonValue = latestESGRun?.carbonReduction || 0;

  const logisticsSignal = normalizedService.includes('logistics') || normalizedService.includes('scm') || normalizedService.includes('supply');
  const procurementSignal = normalizedService.includes('procurement') || normalizedService.includes('supplier') || normalizedService.includes('vendor');
  const esgSignal = normalizedService.includes('esg') || normalizedService.includes('scope 3') || totalCarbonValue >= 150;
  const sixSigmaSignal = normalizedService.includes('six sigma') || normalizedService.includes('defect') || normalizedService.includes('process');

  const highSavings = latestSavingsValue >= 150000 || totalSavingsValue >= 250000;
  const mediumSavings = latestSavingsValue >= 50000 || totalSavingsValue >= 100000;
  const highCarbon = latestCarbonValue >= 200 || totalCarbonValue >= 400;
  const mediumCarbon = latestCarbonValue >= 80 || totalCarbonValue >= 150;

  const recommendations = [];

  if (logisticsSignal && (highSavings || mediumSavings || !recommendations.length)) {
    recommendations.push({
      signal: highSavings ? 'High logistics spend detected' : 'Logistics cost pressure detected',
      recommendation: 'Recommend route optimization diagnostic.',
      detail: 'Focus on lane design, freight mix, and warehouse-to-customer flow to unlock transport savings quickly.',
    });
  }

  if (esgSignal && (highCarbon || mediumCarbon || hasESG)) {
    recommendations.push({
      signal: highCarbon ? 'Carbon waste is above benchmark' : 'Emissions reduction opportunity identified',
      recommendation: 'Recommend Scope 3 supplier mapping.',
      detail: 'Prioritize supplier emissions visibility, factor validation, and a reporting-ready baseline.',
    });
  }

  if (procurementSignal) {
    recommendations.push({
      signal: 'Procurement issue selected',
      recommendation: 'Recommend spend analytics and supplier rationalization.',
      detail: 'Target fragmented categories, supplier overlap, and low-value buying complexity.',
    });
  }

  if (sixSigmaSignal) {
    recommendations.push({
      signal: 'Process stability gap identified',
      recommendation: 'Recommend process capability and root-cause diagnostic.',
      detail: 'Use DMAIC to quantify defect drivers, cycle-time loss, and control breakdowns.',
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      signal: 'Cross-functional transformation need identified',
      recommendation: 'Recommend baseline diagnostic workshop.',
      detail: 'Align stakeholders on cost, service, risk, and ESG priorities before scoping delivery.',
    });
  }

  const leadRecommendation = recommendations[0];
  const derivedRiskLevel =
    activeDiagnostic.riskLevel === 'High' || highCarbon
      ? 'High'
      : activeDiagnostic.riskLevel === 'Low' && !mediumSavings && !mediumCarbon
        ? 'Low'
        : 'Medium';

  const derivedOpportunity =
    activeDiagnostic.opportunity === 'High' || highSavings
      ? 'High'
      : activeDiagnostic.opportunity === 'Low' && !mediumSavings
        ? 'Low'
        : 'Medium';

  const derivedService = procurementSignal
    ? 'Procurement Strategy'
    : esgSignal && (highCarbon || mediumCarbon)
      ? 'ESG Scope 3 Baseline'
      : sixSigmaSignal
        ? 'Six Sigma Process Excellence'
        : logisticsSignal
          ? 'Supply Chain Optimization'
          : activeDiagnostic.recommendedService;

  const derivedNextStep = procurementSignal
    ? 'Book spend diagnostic workshop'
    : esgSignal && (highCarbon || mediumCarbon)
      ? 'Launch supplier emissions mapping sprint'
      : sixSigmaSignal
        ? 'Run defect root-cause workshop'
        : logisticsSignal
          ? 'Book network diagnostic workshop'
          : activeDiagnostic.nextStep;

  const supportingSignals = [
    { label: 'Primary Pain Point', value: hasBookings ? serviceLabel : 'No consultation submitted yet' },
    { label: 'ESG Runs', value: `${data.kpis.totalESGRuns} model${data.kpis.totalESGRuns === 1 ? '' : 's'}` },
    { label: 'Savings Modelled', value: data.kpis.totalESGSavings },
    { label: 'Carbon Reduction', value: data.kpis.totalCarbonReduced },
  ];

  return {
    summary: {
      riskLevel: derivedRiskLevel,
      opportunity: derivedOpportunity,
      recommendedService: derivedService,
      nextStep: derivedNextStep,
    },
    recommendations: recommendations.slice(0, 3),
    leadRecommendation,
    supportingSignals,
  };
};

const KpiCard = ({ icon, label, value, sub, color = 'blue', empty }) => (
  <div className="premium-card p-5 sm:p-6 rounded-2xl flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${KPI_COLOR_CLASSES[color] || KPI_COLOR_CLASSES.blue}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-slate-500 text-sm font-medium mb-0.5">{label}</p>
      <div className={`text-2xl sm:text-3xl font-bold break-words ${empty ? 'text-slate-300' : 'text-slate-900'}`}>
        {value}
      </div>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const EmptyState = ({ icon, title, desc, link, linkLabel }) => (
  <div className="h-56 flex flex-col items-center justify-center text-slate-400 gap-3 px-4 text-center">
    <div className="opacity-30">{icon}</div>
    <p className="font-semibold text-slate-500">{title}</p>
    <p className="text-sm max-w-xs">{desc}</p>
    {link && (
      <Link to={link} className="mt-1 text-blue-600 text-sm font-bold hover:underline flex items-center gap-1">
        {linkLabel} <ArrowRight className="w-3 h-3" />
      </Link>
    )}
  </div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="bg-slate-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-72 bg-slate-700 rounded-xl animate-pulse mb-3"></div>
        <div className="h-4 w-96 max-w-full bg-slate-800 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="h-12 w-12 bg-slate-100 rounded-xl animate-pulse mb-5"></div>
            <div className="h-4 w-28 bg-slate-100 rounded animate-pulse mb-3"></div>
            <div className="h-8 w-20 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="h-5 w-56 bg-slate-100 rounded animate-pulse mb-3"></div>
            <div className="h-4 w-72 bg-slate-100 rounded animate-pulse mb-8"></div>
            <div className="h-56 bg-slate-100 rounded-2xl animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const OnboardingPanel = () => {
  const activationItems = [
    { icon: <ClipboardList className="w-5 h-5" />, title: 'Consultation pipeline', text: 'Submitted requests, scheduled slots, service area, and status tracking.' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'ESG value model', text: 'Saved calculator runs with savings potential and carbon reduction estimates.' },
    { icon: <Activity className="w-5 h-5" />, title: 'Implementation tracker', text: 'DMAIC phase progress, project milestones, and next-action visibility.' },
  ];

  return (
    <div className="premium-card rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Client portal activation</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 mb-3">Your workspace is ready for engagement data</h2>
          <p className="text-slate-600 max-w-2xl leading-relaxed">
            Book a consultation or save an ESG calculation to populate live records. After onboarding, NovaConsult consultants can attach managed workstreams, actions, diagnostics, and documents to your account.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/contact" className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap">Book Consultation</Link>
          <Link to="/esg-calculator" className="text-sm font-bold bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap">Run ESG Calculator</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {activationItems.map((item) => (
          <div key={item.title} className="rounded-2xl bg-slate-50 border border-slate-200 p-5 hover:bg-white hover:shadow-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">{item.icon}</div>
            <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userInfo = (() => {
    try { return JSON.parse(localStorage.getItem('userInfo')); }
    catch { return null; }
  })();

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchMyEngagement()])
      .then(([analyticsRes, engagementRes]) => {
        setData(analyticsRes.data);
        setEngagement(engagementRes.data?.engagement || null);
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          navigate('/auth');
        } else {
          setError('We could not reach the analytics service right now. Your account is still safe, but dashboard metrics are temporarily unavailable.');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/auth');
    window.location.reload();
  };

  if (loading) return <DashboardSkeleton />;

  if (error || !data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white border border-red-100 rounded-3xl shadow-xl max-w-lg mx-4 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Dashboard temporarily unavailable</h1>
        <p className="text-slate-600 leading-relaxed mb-6">{error || 'Something went wrong while loading the portal.'}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/contact" className="bg-blue-600 text-white font-bold px-5 py-3 rounded-xl hover:bg-blue-700">Contact support</Link>
          <Link to="/" className="border border-slate-200 text-slate-700 font-bold px-5 py-3 rounded-xl hover:bg-slate-50">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  const hasBookings = data.recentBookings?.length > 0;
  const hasESG = data.esgTrend?.length > 0;
  const hasByService = data.bookingsByService?.length > 0;
  const hasTrend = data.bookingTrend?.length > 0;
  const activeWorkstreams = engagement?.workstreams?.length ? engagement.workstreams : WORKSTREAMS;
  const activeActions = engagement?.actions?.length ? engagement.actions : ACTIONS;
  const activeDocuments = engagement?.documents?.length ? engagement.documents : DOCUMENTS;
  const activeDiagnostic = engagement?.diagnostic || {
    riskLevel: 'Medium',
    opportunity: 'High',
    recommendedService: 'Supply Chain Optimization',
    nextStep: 'Run diagnostic workshop',
  };
  const diagnosticIntelligence = buildDiagnosticIntelligence({ data, activeDiagnostic, hasBookings, hasESG });

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="bg-slate-900 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-blue-400">{userInfo?.name?.split(' ')[0] || 'Client'}</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Enterprise portal for consultations, ESG models, supplier benchmarks, documents, actions, and implementation progress.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/esg-calculator" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
              Run ESG Calc
            </Link>
            <Link to="/contact" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-slate-700">
              Book Consultation
            </Link>
            <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-red-400 text-sm font-medium transition-colors gap-1">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── New user welcome hint ─────────────────────────────── */}
        {!hasBookings && !hasESG && (
          <OnboardingPanel />
        )}

        <div className="premium-card rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div>
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Engagement command center</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2 mb-2">
                {engagement ? `${engagement.company || engagement.clientName} transformation programme` : 'Operational transformation programme'}
              </h2>
              <p className="text-slate-600 max-w-3xl leading-relaxed">
                A working portal view for active consulting governance: workstreams, ownership, milestones, documents, diagnostics, and client actions in one place.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl px-5 py-4 min-w-[180px]">
              <div className="text-xs font-bold uppercase tracking-wider mb-1">Programme health</div>
              <div className="text-2xl font-black">{engagement?.programmeHealth || 'On Track'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-3 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 sm:p-6">
              <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                      <span className="text-blue-600 text-xs font-black uppercase tracking-wider">Diagnostic Intelligence</span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">Recommended Next Actions</h3>
                      <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                        A rule-based assistant that translates your consultation and ESG signals into practical diagnostic recommendations.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3 max-w-sm min-w-0">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">Lead Recommendation</p>
                      <p className="font-black text-slate-900 break-words">{diagnosticIntelligence.leadRecommendation.signal}</p>
                      <p className="text-sm text-blue-700 font-bold mt-2 break-words">{diagnosticIntelligence.leadRecommendation.recommendation}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
                    {[
                      ['Operational Risk', diagnosticIntelligence.summary.riskLevel],
                      ['Savings Opportunity', diagnosticIntelligence.summary.opportunity],
                      ['Recommended Service', diagnosticIntelligence.summary.recommendedService],
                      ['Next Step', diagnosticIntelligence.summary.nextStep],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-white border border-blue-100 p-4 min-w-0">
                        <p className="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">{label}</p>
                        <p className="text-slate-900 font-black break-words">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {diagnosticIntelligence.recommendations.map((item) => (
                      <div key={`${item.signal}-${item.recommendation}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-blue-700">
                          Diagnostic Signal
                        </span>
                        <p className="font-black text-slate-900 mt-3">{item.signal}</p>
                        <p className="text-sm font-bold text-slate-700 mt-2">{item.recommendation}</p>
                        <p className="text-sm text-slate-500 leading-relaxed mt-2">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Activity className="w-6 h-6 text-blue-400" />
                    <h3 className="font-bold text-lg">Intelligence Inputs</h3>
                  </div>
                  <div className="space-y-4">
                    {diagnosticIntelligence.supportingSignals.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 min-w-0">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">{item.label}</p>
                        <p className="font-bold text-white mt-2 break-words">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 mt-4">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Current Risk Posture</p>
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${getSeverityClasses(diagnosticIntelligence.summary.riskLevel)}`}>
                      {diagnosticIntelligence.summary.riskLevel} priority diagnostic
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed mt-3">
                      We are prioritizing the next workshop around the strongest cost, service, or sustainability signal in your current data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {activeWorkstreams.map((item) => (
                <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{item.owner}</p>
                    </div>
                    <span className="self-start bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: `${item.progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item.progress}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                    <CalendarDays className="w-4 h-4" /> Next checkpoint: {item.due}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6">
              <div className="flex items-center gap-3 mb-5">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold text-lg">Governance Cadence</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div className="border-b border-slate-700 pb-4">
                  <div className="text-slate-400 mb-1">Weekly working session</div>
                  <div className="font-bold">Every Tuesday, 11:00 AM IST</div>
                </div>
                <div className="border-b border-slate-700 pb-4">
                  <div className="text-slate-400 mb-1">Steering committee</div>
                  <div className="font-bold">Second Friday of each month</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Benefit tracking</div>
                  <div className="font-bold">Savings, service, risk, and ESG scorecard</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI Cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KpiCard
            icon={<Briefcase className="w-6 h-6" />}
            label="My Consultation Requests"
            value={data.kpis.totalBookings}
            sub="Submitted via contact form"
            color="blue"
            empty={data.kpis.totalBookings === 0}
          />
          <KpiCard
            icon={<DollarSign className="w-6 h-6" />}
            label="My ESG Savings Modelled"
            value={data.kpis.totalESGSavings}
            sub="Across all my calculator runs"
            color="emerald"
            empty={data.kpis.totalESGRuns === 0}
          />
          <KpiCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="My ESG Calculator Runs"
            value={data.kpis.totalESGRuns}
            sub="Total calculations performed"
            color="indigo"
            empty={data.kpis.totalESGRuns === 0}
          />
          <KpiCard
            icon={<Leaf className="w-6 h-6" />}
            label="My Carbon Reduction"
            value={data.kpis.totalCarbonReduced}
            sub="Projected Scope 3 reduction"
            color="teal"
            empty={data.kpis.totalESGRuns === 0}
          />
        </div>

        {/* ── DMAIC Project Tracker ────────────────────────────────*/}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl text-white">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Active Implementation: Project Zero-Defect</h2>
              <p className="text-slate-400 text-sm">Six Sigma DMAIC Methodology Tracker</p>
            </div>
            <span className="self-start bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">In Progress</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {DMAIC.map((phase) => (
              <div key={phase.name} className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`font-bold uppercase tracking-wider text-xs ${
                    phase.progress === 100 ? 'text-emerald-400' :
                    phase.progress > 0 ? 'text-blue-400' : 'text-slate-500'
                  }`}>{phase.name}</h3>
                  <span className="text-xs text-slate-500">{phase.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${phase.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-2">{phase.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Charts Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

          {/* Booking Trend */}
          <div className="premium-card p-6 sm:p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">My Consultation Request Trend</h3>
            <p className="text-slate-500 text-sm mb-6">Your monthly consultation submissions</p>
            {hasTrend ? (
              <div className="h-60 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.bookingTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="bookings" name="Requests" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={<Briefcase className="w-12 h-12" />}
                title="No consultation requests yet"
                desc="Submit a consultation via the contact form and it will appear here."
                link="/contact"
                linkLabel="Book a consultation"
              />
            )}
          </div>

          {/* ESG Savings Bar */}
          <div className="premium-card p-6 sm:p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">My ESG Optimization Potential</h3>
            <p className="text-slate-500 text-sm mb-6">Savings modelled across each of your ESG runs</p>
            {hasESG ? (
              <div className="h-60 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.esgTrend} margin={{ left: 0, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v) => [`$${v.toLocaleString()}`, 'Savings Potential']} />
                    <Bar dataKey="savings" name="Savings Potential" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={<TrendingUp className="w-12 h-12" />}
                title="No ESG calculations yet"
                desc="Run the ESG calculator to model your savings and carbon reduction potential."
                link="/esg-calculator"
                linkLabel="Open ESG Calculator"
              />
            )}
          </div>

          {/* Bookings by Service Pie */}
          <div className="premium-card p-6 sm:p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">My Requests by Service Area</h3>
            <p className="text-slate-500 text-sm mb-6">Breakdown of your submitted consultation areas</p>
            {hasByService ? (
              <div className="h-60 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.bookingsByService} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%" paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {data.bookingsByService.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={<Briefcase className="w-12 h-12" />}
                title="No service data yet"
                desc="Your requested service areas will appear here after booking."
                link="/contact"
                linkLabel="Book a consultation"
              />
            )}
          </div>

          {/* Vendor Radar — static benchmark */}
          <div className="premium-card p-6 sm:p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Supplier Benchmark</h3>
            <p className="text-slate-500 text-sm mb-2">Our primary vendor vs industry average — updated quarterly</p>
            <div className="h-60 sm:h-72 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.vendorPerformanceData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Our Vendor" dataKey="score" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.4} />
                  <Radar name="Industry Avg" dataKey="avg" stroke="#cbd5e1" strokeWidth={2} fill="#cbd5e1" fillOpacity={0.2} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── My Recent Bookings Table ─────────────────────────────*/}
        <div className="premium-card rounded-3xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">My Consultation Requests</h3>
              <p className="text-slate-500 text-sm">Requests you have submitted through NovaConsult</p>
            </div>
            <Link to="/contact" className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1 self-start sm:self-auto">
              New request <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {hasBookings ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service Area</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">{b.firstName} {b.lastName}</td>
                      <td className="px-6 py-4 text-slate-500 hidden sm:table-cell">{b.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{b.interestArea}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 hidden md:table-cell whitespace-nowrap">
                        {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Received
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center text-slate-400 gap-3">
              <Clock className="w-10 h-10 opacity-30" />
              <p className="font-semibold text-slate-500">No requests yet</p>
              <p className="text-sm text-center max-w-xs">When you submit a consultation via the contact form, it will appear here.</p>
              <Link to="/contact" className="mt-2 text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                Book a free strategy call <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="premium-card rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Action Register</h3>
              <p className="text-slate-500 text-sm">Open items required to keep transformation work moving</p>
            </div>
            <div className="divide-y divide-slate-100">
              {activeActions.map((action) => (
                <div key={action.task} className="p-5 sm:p-6 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900">{action.task}</h4>
                    <p className="text-sm text-slate-500 mt-1">{action.owner}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${action.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{action.priority}</span>
                    <div className="text-xs text-slate-400 mt-2">Due {action.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Document Vault</h3>
              <p className="text-slate-500 text-sm">Commercial, governance, and data documents for the engagement</p>
            </div>
            <div className="divide-y divide-slate-100">
              {activeDocuments.map((doc) => (
                <div key={doc.title} className="p-5 sm:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{doc.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{doc.type}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-full">{doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
