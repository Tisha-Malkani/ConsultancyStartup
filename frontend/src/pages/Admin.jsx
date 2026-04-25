import { useEffect, useMemo, useState } from 'react';
import { Activity, Briefcase, CheckCircle2, FileText, Plus, RefreshCw, Users, PencilLine, Trash2, ShieldCheck, ClipboardList, Search, Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { createEngagement, fetchAdminOverview, updateEngagement } from '../api/api.js';

const createBlankWorkstream = () => ({
  name: '',
  owner: '',
  status: 'Active',
  progress: 0,
  due: '',
});

const createBlankAction = () => ({
  task: '',
  owner: '',
  due: '',
  priority: 'Medium',
});

const createBlankDocument = () => ({
  title: '',
  type: 'Governance',
  status: 'Open',
});

const getDefaultFormData = () => ({
  clientName: '',
  clientEmail: '',
  company: '',
  programmeHealth: 'On Track',
  riskLevel: 'Medium',
  opportunity: 'High',
  recommendedService: 'Supply Chain Optimization',
  nextStep: 'Run diagnostic workshop',
  workstreams: [
    { name: 'Supply Chain Diagnostic', owner: 'NovaConsult + Operations', status: 'Active', progress: 72, due: '14 May 2026' },
    { name: 'Supplier Risk Scorecard', owner: 'Procurement Lead', status: 'In Review', progress: 54, due: '21 May 2026' },
    { name: 'ESG Baseline Model', owner: 'Sustainability Lead', status: 'Awaiting Data', progress: 38, due: '28 May 2026' },
  ],
  actions: [
    { task: 'Upload top 50 supplier spend file', owner: 'Client Procurement', due: '29 Apr', priority: 'High' },
    { task: 'Validate logistics lane baseline', owner: 'Operations PMO', due: '02 May', priority: 'Medium' },
  ],
  documents: [
    { title: 'Statement of Work', type: 'Commercial', status: 'Signed' },
    { title: 'Baseline Data Request', type: 'Data Pack', status: 'Open' },
  ],
});

const ENGAGEMENT_BLUEPRINTS = [
  {
    label: 'Supply Chain',
    service: 'Supply Chain Optimization',
    riskLevel: 'Medium',
    opportunity: 'High',
    nextStep: 'Book network diagnostic workshop',
    note: 'Cost, service, and route efficiency',
  },
  {
    label: 'Procurement',
    service: 'Procurement Strategy',
    riskLevel: 'Medium',
    opportunity: 'High',
    nextStep: 'Book spend diagnostic workshop',
    note: 'Supplier rationalization and spend visibility',
  },
  {
    label: 'ESG',
    service: 'ESG Scope 3 Baseline',
    riskLevel: 'High',
    opportunity: 'Medium',
    nextStep: 'Launch supplier emissions mapping sprint',
    note: 'Scope 3 readiness and supplier mapping',
  },
  {
    label: 'Process',
    service: 'Six Sigma Process Excellence',
    riskLevel: 'Medium',
    opportunity: 'High',
    nextStep: 'Run defect root-cause workshop',
    note: 'DMAIC and process capability review',
  },
];

const mapEngagementToForm = (engagement) => ({
  clientName: engagement.clientName || '',
  clientEmail: engagement.clientEmail || '',
  company: engagement.company || '',
  programmeHealth: engagement.programmeHealth || 'On Track',
  riskLevel: engagement.diagnostic?.riskLevel || 'Medium',
  opportunity: engagement.diagnostic?.opportunity || 'High',
  recommendedService: engagement.diagnostic?.recommendedService || 'Supply Chain Optimization',
  nextStep: engagement.diagnostic?.nextStep || 'Run diagnostic workshop',
  workstreams: engagement.workstreams?.length ? engagement.workstreams : [createBlankWorkstream()],
  actions: engagement.actions?.length ? engagement.actions : [createBlankAction()],
  documents: engagement.documents?.length ? engagement.documents : [createBlankDocument()],
});

const statusTone = (value) => {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('high') || normalized.includes('off track')) return 'bg-red-50 text-red-700 border-red-100';
  if (normalized.includes('medium') || normalized.includes('review') || normalized.includes('awaiting')) return 'bg-amber-50 text-amber-700 border-amber-100';
  if (normalized.includes('low') || normalized.includes('on track') || normalized.includes('signed') || normalized.includes('active')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

const formatCurrency = (value) => `$${Math.round(value || 0).toLocaleString()}`;
const formatTons = (value) => `${Math.round(value || 0).toLocaleString()} Tons`;

const buildAdminDiagnosticPreview = (engagement) => {
  const preview = engagement.analyticsPreview || {};
  const serviceLabel = preview.primaryPainPoint || engagement.diagnostic?.recommendedService || 'General Diagnostic';
  const normalizedService = serviceLabel.toLowerCase();
  const totalSavingsValue = preview.totalESGSavings || 0;
  const totalCarbonValue = preview.totalCarbonReduced || 0;
  const latestSavingsValue = preview.latestESGRun?.optimizationPotential || 0;
  const latestCarbonValue = preview.latestESGRun?.carbonReduction || 0;

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
    recommendations.push('High logistics spend detected. Recommend route optimization diagnostic.');
  }
  if (esgSignal && (highCarbon || mediumCarbon || preview.totalESGRuns > 0)) {
    recommendations.push('Carbon waste is above benchmark. Recommend Scope 3 supplier mapping.');
  }
  if (procurementSignal) {
    recommendations.push('Procurement issue selected. Recommend spend analytics and supplier rationalization.');
  }
  if (sixSigmaSignal) {
    recommendations.push('Process stability gap identified. Recommend process capability and root-cause diagnostic.');
  }
  if (!recommendations.length) {
    recommendations.push('Cross-functional transformation need identified. Recommend baseline diagnostic workshop.');
  }

  return {
    leadRecommendation: recommendations[0],
    summary: {
      riskLevel:
        engagement.diagnostic?.riskLevel === 'High' || highCarbon ? 'High'
          : engagement.diagnostic?.riskLevel === 'Low' && !mediumSavings && !mediumCarbon ? 'Low'
            : 'Medium',
      opportunity:
        engagement.diagnostic?.opportunity === 'High' || highSavings ? 'High'
          : engagement.diagnostic?.opportunity === 'Low' && !mediumSavings ? 'Low'
            : 'Medium',
      recommendedService: procurementSignal
        ? 'Procurement Strategy'
        : esgSignal && (highCarbon || mediumCarbon)
          ? 'ESG Scope 3 Baseline'
          : sixSigmaSignal
            ? 'Six Sigma Process Excellence'
            : logisticsSignal
              ? 'Supply Chain Optimization'
              : engagement.diagnostic?.recommendedService,
      nextStep: procurementSignal
        ? 'Book spend diagnostic workshop'
        : esgSignal && (highCarbon || mediumCarbon)
          ? 'Launch supplier emissions mapping sprint'
          : sixSigmaSignal
            ? 'Run defect root-cause workshop'
            : logisticsSignal
              ? 'Book network diagnostic workshop'
              : engagement.diagnostic?.nextStep,
    },
    supportingSignals: [
      { label: 'Primary Pain Point', value: serviceLabel || 'No consultation history yet' },
      { label: 'Consultation Requests', value: String(preview.totalBookings || 0) },
      { label: 'ESG Runs', value: String(preview.totalESGRuns || 0) },
      { label: 'Savings Modelled', value: formatCurrency(totalSavingsValue) },
      { label: 'Carbon Reduction', value: formatTons(totalCarbonValue) },
    ],
  };
};

const Admin = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editorTab, setEditorTab] = useState('Overview');
  const [expandedEngagementId, setExpandedEngagementId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('All');
  const [formData, setFormData] = useState(getDefaultFormData());

  const loadOverview = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchAdminOverview();
      setOverview(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load admin overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    fetchAdminOverview()
      .then(({ data }) => {
        if (!cancelled) setOverview(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Could not load admin overview.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setEditingId('');
    setEditorTab('Overview');
    setFormData(getDefaultFormData());
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const updateArrayItem = (group, index, key, value) => {
    setFormData((current) => ({
      ...current,
      [group]: current[group].map((item, itemIndex) => (
        itemIndex === index ? { ...item, [key]: key === 'progress' ? Number(value) : value } : item
      )),
    }));
  };

  const addArrayItem = (group) => {
    const factoryMap = {
      workstreams: createBlankWorkstream,
      actions: createBlankAction,
      documents: createBlankDocument,
    };

    setFormData((current) => ({
      ...current,
      [group]: [...current[group], factoryMap[group]()],
    }));
  };

  const removeArrayItem = (group, index) => {
    setFormData((current) => ({
      ...current,
      [group]: current[group].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const startEdit = (engagement) => {
    setEditingId(engagement._id);
    setEditorTab('Overview');
    setExpandedEngagementId(engagement._id);
    setFormData(mapEngagementToForm(engagement));
    setStatus('');
    setError('');
  };

  const applyBlueprint = (blueprint) => {
    setFormData((current) => ({
      ...current,
      recommendedService: blueprint.service,
      riskLevel: blueprint.riskLevel,
      opportunity: blueprint.opportunity,
      nextStep: blueprint.nextStep,
    }));
    setEditorTab('Overview');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    setError('');
    try {
      const payload = {
        ...formData,
        workstreams: formData.workstreams.filter((item) => item.name.trim() && item.owner.trim()),
        actions: formData.actions.filter((item) => item.task.trim() && item.owner.trim()),
        documents: formData.documents.filter((item) => item.title.trim()),
      };

      if (editingId) {
        await updateEngagement(editingId, payload);
        setStatus('Client engagement updated. The client dashboard will reflect the revised programme data.');
      } else {
        await createEngagement(payload);
        setStatus('Client engagement created. The matching client can now see it in their dashboard.');
      }

      resetForm();
      await loadOverview();
    } catch (err) {
      setError(err.response?.data?.error || `Could not ${editingId ? 'update' : 'create'} engagement.`);
    } finally {
      setSaving(false);
    }
  };

  const kpis = overview?.kpis || { clients: 0, bookings: 0, esgRuns: 0, engagements: 0 };
  const filteredEngagements = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return (overview?.engagements || []).filter((engagement) => {
      const matchesQuery = !query || [
        engagement.clientName,
        engagement.clientEmail,
        engagement.company,
        engagement.diagnostic?.recommendedService,
        engagement.analyticsPreview?.primaryPainPoint,
      ].some((value) => String(value || '').toLowerCase().includes(query));

      const matchesProgramme = programmeFilter === 'All' || engagement.programmeHealth === programmeFilter;
      return matchesQuery && matchesProgramme;
    });
  }, [overview?.engagements, programmeFilter, searchTerm]);
  const liveOpsSnapshot = useMemo(() => ([
    { label: 'On Track', value: (overview?.engagements || []).filter((item) => item.programmeHealth === 'On Track').length },
    { label: 'Needs Attention', value: (overview?.engagements || []).filter((item) => item.programmeHealth === 'Needs Attention').length },
    { label: 'Off Track', value: (overview?.engagements || []).filter((item) => item.programmeHealth === 'Off Track').length },
    { label: 'Filtered View', value: filteredEngagements.length },
  ]), [filteredEngagements.length, overview?.engagements]);
  const editorCompletion = [
    { label: 'Workstreams', value: formData.workstreams.filter((item) => item.name.trim() && item.owner.trim()).length },
    { label: 'Actions', value: formData.actions.filter((item) => item.task.trim() && item.owner.trim()).length },
    { label: 'Documents', value: formData.documents.filter((item) => item.title.trim()).length },
  ];
  const draftPreview = {
    riskLevel: formData.riskLevel,
    opportunity: formData.opportunity,
    recommendedService: formData.recommendedService,
    nextStep: formData.nextStep,
    company: formData.company || 'No company assigned yet',
    client: formData.clientName || 'Unnamed client',
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-slate-900 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className="text-blue-300 text-xs font-black uppercase tracking-wider">NovaConsult internal</span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">Consultant Admin Workspace</h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Create client engagement records, monitor enquiries, and manage diagnostic context that appears in client dashboards.
            </p>
          </div>
          <button onClick={loadOverview} className="inline-flex items-center justify-center bg-slate-800 border border-slate-700 text-white font-bold px-5 py-3 rounded-xl hover:bg-slate-700">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </button>
        </div>
      </section>

      <main className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4 font-semibold">{error}</div>}
        {status && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4 font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> {status}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Client Users', value: kpis.clients, icon: <Users className="w-6 h-6" /> },
            { label: 'Consultation Requests', value: kpis.bookings, icon: <Briefcase className="w-6 h-6" /> },
            { label: 'ESG Runs', value: kpis.esgRuns, icon: <Activity className="w-6 h-6" /> },
            { label: 'Engagements', value: kpis.engagements, icon: <FileText className="w-6 h-6" /> },
          ].map((item) => (
            <div key={item.label} className="premium-card rounded-2xl p-6 sm:p-7 flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">{item.icon}</div>
              <div>
                <p className="text-slate-500 text-sm sm:text-[15px] font-semibold">{item.label}</p>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="premium-card rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-8 border-b xl:border-b-0 xl:border-r border-slate-100">
              <span className="text-blue-600 text-xs font-black uppercase tracking-wider">Operations Snapshot</span>
              <h2 className="text-2xl sm:text-[30px] font-black text-slate-900 mt-2">Commercial delivery at a glance</h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl leading-relaxed">
                Review live programme health, narrow the engagement list, and move into editing without losing the bigger operating picture.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4 bg-slate-50">
              {liveOpsSnapshot.map((item) => (
                <div key={item.label} className="p-5 sm:p-6 border-b border-slate-200/80 even:border-l sm:[&:nth-child(3)]:border-b-0 sm:[&:nth-child(4)]:border-b-0 xl:[&:nth-child(3)]:border-b xl:[&:nth-child(4)]:border-b 2xl:[&:nth-child(3)]:border-b-0 2xl:[&:nth-child(4)]:border-b-0">
                  <p className="text-[11px] sm:text-xs leading-5 font-black uppercase tracking-[0.06em] text-slate-500 break-words">{item.label}</p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-8">
          <section className="premium-card rounded-3xl p-6 sm:p-8 lg:p-9">
            <div className="flex flex-col gap-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Plus className="w-5 h-5" /></div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{editingId ? 'Edit Client Engagement' : 'Create Client Engagement'}</h2>
                  <p className="text-sm sm:text-base text-slate-500">Use the same email as the client account and manage the exact content shown in the client portal.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">{editingId ? 'Editing Live Account' : 'New Engagement Draft'}</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 break-words">{formData.clientName || formData.company || 'Untitled engagement'}</p>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">{formData.clientEmail || 'No client email added yet'}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                    {editorCompletion.map((item) => (
                      <div key={item.label} className="rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-3 sm:py-4 text-center min-w-0">
                        <p className="text-[11px] sm:text-xs leading-5 font-black uppercase tracking-[0.06em] text-slate-500 break-words">{item.label}</p>
                        <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-1.5 grid grid-cols-3 gap-1">
                {['Overview', 'Delivery', 'Docs'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setEditorTab(tab)}
                    className={`px-4 py-3.5 rounded-xl text-sm sm:text-base font-black transition-colors ${
                      editorTab === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {editorTab === 'Overview' && (
                <>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-black text-slate-900">Engagement Blueprint</h3>
                        <p className="text-sm text-slate-500">Start from a proven consulting setup and adjust it as needed.</p>
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-blue-600">Quick Apply</span>
                    </div>
                    <div className="p-4 sm:p-5 bg-slate-50 overflow-x-auto">
                      <div className="flex gap-3 min-w-max">
                      {ENGAGEMENT_BLUEPRINTS.map((blueprint) => (
                        <button
                          key={blueprint.label}
                          type="button"
                          onClick={() => applyBlueprint(blueprint)}
                          className="text-left rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-200 hover:shadow-lg transition-all w-[260px] flex-shrink-0"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-black text-slate-900">{blueprint.label}</p>
                            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">Preset</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-2">{blueprint.note}</p>
                          <p className="text-sm font-bold text-slate-800 mt-3 break-words">{blueprint.service}</p>
                        </button>
                      ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm sm:text-[15px] font-bold text-slate-700 mb-2">Client Name</label>
                      <input name="clientName" value={formData.clientName} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Priya Sharma" />
                    </div>
                    <div>
                      <label className="block text-sm sm:text-[15px] font-bold text-slate-700 mb-2">Client Email</label>
                      <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="client@company.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-[15px] font-bold text-slate-700 mb-2">Company</label>
                    <input name="company" value={formData.company} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Company name" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm sm:text-[15px] font-bold text-slate-700 mb-2">Programme Health</label>
                      <select name="programmeHealth" value={formData.programmeHealth} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>On Track</option>
                        <option>Needs Attention</option>
                        <option>Off Track</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-[15px] font-bold text-slate-700 mb-2">Recommended Service</label>
                      <select name="recommendedService" value={formData.recommendedService} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Supply Chain Optimization</option>
                        <option>Vendor Development</option>
                        <option>Procurement Strategy</option>
                        <option>Six Sigma Process Excellence</option>
                        <option>ESG Scope 3 Baseline</option>
                        <option>Inventory Optimization</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm sm:text-[15px] font-bold text-slate-700 mb-2">Risk Level</label>
                      <select name="riskLevel" value={formData.riskLevel} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm sm:text-[15px] font-bold text-slate-700 mb-2">Opportunity</label>
                      <select name="opportunity" value={formData.opportunity} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm sm:text-[15px] font-bold text-slate-700 mb-2">Next Step</label>
                    <input name="nextStep" value={formData.nextStep} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-black text-slate-900">Client Portal Preview</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        ['Client', draftPreview.client],
                        ['Company', draftPreview.company],
                        ['Risk', draftPreview.riskLevel],
                        ['Opportunity', draftPreview.opportunity],
                        ['Service', draftPreview.recommendedService],
                        ['Next Step', draftPreview.nextStep],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-blue-100 bg-white p-3 min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-wider text-blue-600">{label}</p>
                          <p className="font-bold text-slate-900 mt-2 break-words">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {editorTab === 'Delivery' && (
                <>
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-900">Workstreams</h3>
                    <p className="text-sm text-slate-500">Control active transformation tracks visible on the client dashboard.</p>
                  </div>
                  <button type="button" onClick={() => addArrayItem('workstreams')} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-bold">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="p-4 sm:p-5 space-y-4 bg-slate-50">
                  {formData.workstreams.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-black text-slate-900">Workstream {index + 1}</p>
                        {formData.workstreams.length > 1 && (
                          <button type="button" onClick={() => removeArrayItem('workstreams', index)} className="text-slate-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={item.name} onChange={(e) => updateArrayItem('workstreams', index, 'name', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Workstream name" />
                        <input value={item.owner} onChange={(e) => updateArrayItem('workstreams', index, 'owner', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Owner" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <select value={item.status} onChange={(e) => updateArrayItem('workstreams', index, 'status', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Active</option>
                          <option>In Review</option>
                          <option>Awaiting Data</option>
                          <option>Completed</option>
                        </select>
                        <input type="number" min="0" max="100" value={item.progress} onChange={(e) => updateArrayItem('workstreams', index, 'progress', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Progress %" />
                        <input value={item.due} onChange={(e) => updateArrayItem('workstreams', index, 'due', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Checkpoint date" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-900">Action Register</h3>
                    <p className="text-sm text-slate-500">Set client-owned actions and urgency levels.</p>
                  </div>
                  <button type="button" onClick={() => addArrayItem('actions')} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-bold">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="p-4 sm:p-5 space-y-4 bg-slate-50">
                  {formData.actions.map((item, index) => (
                    <div key={`${item.task}-${index}`} className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                      <p className="text-sm sm:text-[15px] font-black text-slate-900">Action {index + 1}</p>
                        {formData.actions.length > 1 && (
                          <button type="button" onClick={() => removeArrayItem('actions', index)} className="text-slate-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={item.task} onChange={(e) => updateArrayItem('actions', index, 'task', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Action task" />
                        <input value={item.owner} onChange={(e) => updateArrayItem('actions', index, 'owner', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Owner" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={item.due} onChange={(e) => updateArrayItem('actions', index, 'due', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Due date" />
                        <select value={item.priority} onChange={(e) => updateArrayItem('actions', index, 'priority', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                </>
              )}

              {editorTab === 'Docs' && (
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-900">Document Vault</h3>
                    <p className="text-sm text-slate-500">Publish the key documents the client should see.</p>
                  </div>
                  <button type="button" onClick={() => addArrayItem('documents')} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-bold">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="p-4 sm:p-5 space-y-4 bg-slate-50">
                  {formData.documents.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                      <p className="text-sm sm:text-[15px] font-black text-slate-900">Document {index + 1}</p>
                        {formData.documents.length > 1 && (
                          <button type="button" onClick={() => removeArrayItem('documents', index)} className="text-slate-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input value={item.title} onChange={(e) => updateArrayItem('documents', index, 'title', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Document title" />
                        <input value={item.type} onChange={(e) => updateArrayItem('documents', index, 'type', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type" />
                        <select value={item.status} onChange={(e) => updateArrayItem('documents', index, 'status', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Open</option>
                          <option>Published</option>
                          <option>Signed</option>
                          <option>Draft</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 sm:py-4.5 rounded-xl transition-colors text-sm sm:text-base">
                  {saving ? (editingId ? 'Updating Engagement...' : 'Creating Engagement...') : (editingId ? 'Save Engagement' : 'Create Engagement')}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="sm:w-auto border border-slate-200 text-slate-700 font-black py-4 px-6 rounded-xl hover:bg-slate-50 transition-colors text-sm sm:text-base">
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="premium-card rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Active Engagements</h2>
              <p className="text-sm text-slate-500 mt-1">Records created by NovaConsult consultants.</p>
            </div>
              <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50">
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_220px] gap-4">
                <label className="relative block">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by client, company, pain point, or service"
                  />
                </label>
                <select value={programmeFilter} onChange={(e) => setProgrammeFilter(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All</option>
                  <option>On Track</option>
                  <option>Needs Attention</option>
                  <option>Off Track</option>
                </select>
              </div>
            </div>
            {loading ? (
              <div className="p-8 text-slate-500 font-semibold">Loading admin data...</div>
            ) : filteredEngagements.length ? (
              <div className="divide-y divide-slate-100">
                {filteredEngagements.map((engagement) => {
                  const diagnosticPreview = buildAdminDiagnosticPreview(engagement);
                  const isExpanded = expandedEngagementId === engagement._id;
                  return (
                  <div key={engagement._id} className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-slate-900">{engagement.clientName}</h3>
                          <span className={`self-start border text-xs font-black px-3 py-1 rounded-full ${statusTone(engagement.programmeHealth)}`}>{engagement.programmeHealth}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 break-all">{engagement.company || 'No company added'} | {engagement.clientEmail}</p>
                        <p className="text-sm text-slate-600 mt-2 max-w-2xl">{diagnosticPreview.leadRecommendation}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setExpandedEngagementId(isExpanded ? '' : engagement._id)}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700 hover:bg-slate-50"
                        >
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                        <button type="button" onClick={() => startEdit(engagement)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700 hover:bg-slate-50">
                          <PencilLine className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                      <div className="rounded-xl bg-slate-50 p-3.5 min-w-0">
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.05em]">Risk</p>
                        <p className="font-black text-slate-900 break-words">{engagement.diagnostic?.riskLevel}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3.5 min-w-0">
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.05em]">Opportunity</p>
                        <p className="font-black text-slate-900 break-words">{engagement.diagnostic?.opportunity}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3.5 min-w-0">
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.05em]">Recommended Service</p>
                        <p className="font-black text-slate-900 break-words">{engagement.diagnostic?.recommendedService}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3.5 min-w-0">
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.05em]">Workstreams</p>
                        <p className="font-black text-slate-900">{engagement.workstreams?.length || 0}</p>
                      </div>
                    </div>

                    {!isExpanded && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                        {diagnosticPreview.supportingSignals.slice(0, 4).map((item) => (
                          <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3.5 min-w-0">
                            <p className="text-[11px] leading-5 font-black uppercase tracking-[0.06em] text-slate-500 break-words">{item.label}</p>
                            <p className="font-bold text-slate-900 mt-2 break-words">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {isExpanded && (
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-4">
                      <div className="rounded-2xl bg-slate-950 text-white p-4 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                          <p className="text-sm font-black">Client-Facing Diagnostic Summary</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 min-w-0">
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.05em]">Next Step</p>
                            <p className="font-bold text-white mt-2 break-words">{engagement.diagnostic?.nextStep}</p>
                          </div>
                          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 min-w-0">
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.05em]">Actions</p>
                            <p className="font-bold text-white mt-2">{engagement.actions?.length || 0} open items</p>
                          </div>
                          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 min-w-0">
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.05em]">Documents</p>
                            <p className="font-bold text-white mt-2">{engagement.documents?.length || 0} published items</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <p className="text-sm font-black text-slate-900">Diagnostic Intelligence Preview</p>
                        </div>
                        <p className="text-sm font-bold text-blue-700">{diagnosticPreview.leadRecommendation}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {[
                            ['Risk', diagnosticPreview.summary.riskLevel],
                            ['Opportunity', diagnosticPreview.summary.opportunity],
                            ['Service', diagnosticPreview.summary.recommendedService],
                            ['Next Step', diagnosticPreview.summary.nextStep],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-xl border border-blue-100 bg-white p-3 min-w-0">
                              <p className="text-[11px] font-black uppercase tracking-[0.06em] text-blue-600">{label}</p>
                              <p className="font-bold text-slate-900 mt-2 break-words">{value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {diagnosticPreview.supportingSignals.map((item) => (
                            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3 min-w-0">
                              <p className="text-[11px] font-black uppercase tracking-[0.06em] text-slate-500 break-words">{item.label}</p>
                              <p className="font-bold text-slate-900 mt-2 break-words">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    )}
                    </div>
                  </div>
                )})}
              </div>
            ) : (
              <div className="p-8 text-slate-500 font-semibold">No engagements match the current filters.</div>
            )}
          </section>
        </div>

        <section className="premium-card rounded-3xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900">Recent Consultation Requests</h2>
            <p className="text-sm text-slate-500 mt-1">Incoming client demand from the public contact form.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service Area</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(overview?.recentBookings || []).map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">{booking.firstName} {booking.lastName}</td>
                    <td className="px-6 py-4 text-slate-500">{booking.email}</td>
                    <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{booking.interestArea}</span></td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{new Date(booking.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="premium-card rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Recent ESG Runs</h2>
              <p className="text-sm text-slate-500 mt-1">Latest model outputs captured from the ESG calculator.</p>
            </div>
            <div className="divide-y divide-slate-100">
              {(overview?.recentESGRuns || []).slice(0, 6).map((run) => (
                <div key={run._id} className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Logistics Spend</p>
                    <p className="font-black text-slate-900 mt-1">${Math.round(run.logisticsSpend).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Savings Potential</p>
                    <p className="font-black text-emerald-700 mt-1">${Math.round(run.optimizationPotential).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Carbon Reduction</p>
                    <p className="font-black text-slate-900 mt-1">{Math.round(run.carbonReduction).toLocaleString()} tons</p>
                  </div>
                </div>
              ))}
              {!overview?.recentESGRuns?.length && (
                <div className="p-8 text-slate-500 font-semibold">No ESG runs captured yet.</div>
              )}
            </div>
          </div>

          <div className="premium-card rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Commercial Readiness</h2>
              <p className="text-sm text-slate-500 mt-1">Quick checks for what a client will actually experience in the portal.</p>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              {[
                { label: 'Engagement records with diagnostic', value: `${overview?.engagements?.length || 0} live`, icon: <ShieldCheck className="w-5 h-5" /> },
                { label: 'Client action registers configured', value: `${overview?.engagements?.filter((item) => item.actions?.length).length || 0} ready`, icon: <ClipboardList className="w-5 h-5" /> },
                { label: 'Document vaults published', value: `${overview?.engagements?.filter((item) => item.documents?.length).length || 0} populated`, icon: <FileText className="w-5 h-5" /> },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
