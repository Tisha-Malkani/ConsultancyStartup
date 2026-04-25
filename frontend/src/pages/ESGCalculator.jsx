import { useMemo, useState } from 'react';
import { ArrowRight, BarChart3, Calculator, CheckCircle2, Gauge, Info, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateESG } from '../api/api.js';
import { industryOptions } from '../data/industryData.js';

const scenarioOptions = [
  { value: 'conservative', label: 'Conservative', detail: 'Lower-confidence savings and carbon assumptions.' },
  { value: 'expected', label: 'Expected', detail: 'Balanced operating case for most diagnostics.' },
  { value: 'aggressive', label: 'Aggressive', detail: 'Higher-impact transformation scenario.' },
];

const transportOptions = [
  { value: 'mixed', label: 'Mixed Network' },
  { value: 'road', label: 'Road Freight' },
  { value: 'ocean', label: 'Ocean / Container' },
  { value: 'air', label: 'Air Freight' },
  { value: 'warehousing', label: 'Warehouse / Storage' },
];

const complexityOptions = [
  { value: 'local', label: 'Local Supplier Base' },
  { value: 'regional', label: 'Regional Supplier Base' },
  { value: 'global', label: 'Global Multi-Tier Base' },
];

const defaultFormData = {
  logisticsSpend: '',
  carbonWaste: '',
  scenario: 'expected',
  industry: 'general',
  transportMode: 'mixed',
  supplierComplexity: 'regional',
};

const ESGCalculator = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useMemo(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
      return Boolean(userInfo?.token);
    } catch {
      return false;
    }
  }, []);

  const activeScenario = useMemo(
    () => scenarioOptions.find((option) => option.value === formData.scenario) || scenarioOptions[1],
    [formData.scenario]
  );

  const handleChange = (e) => setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await calculateESG(formData);
      setResult(data);
    } catch (err) {
      setError(
        err.request
          ? 'The calculator service is temporarily unavailable. Please check that the backend is running, or try again shortly.'
          : err.response?.data?.error || 'Failed to calculate metrics.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const insightCards = result
    ? [
        { label: 'Monthly Savings Potential', value: formatCurrency(result.optimizationPotential), tone: 'emerald' },
        { label: 'Annualized Value Pool', value: formatCurrency(result.annualizedSavings), tone: 'blue' },
        { label: 'Carbon Reduction', value: `${Number(result.carbonReduction).toLocaleString()} tons`, tone: 'teal' },
        { label: 'Opportunity Score', value: `${result.opportunityScore}/100`, tone: 'violet' },
      ]
    : [];

  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="relative overflow-hidden bg-slate-950 px-4 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/20 text-blue-300">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              ESG & Value Creation Calculator
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              {isLoggedIn
                ? 'Model savings, emissions reduction, and the right consulting intervention using a scenario-aware ESG diagnostic.'
                : 'Enter your baseline metrics to instantly see your optimization potential and carbon reduction impact.'}
            </p>
          </div>

          {isLoggedIn && (
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-300">Scenario</p>
              <p className="mt-3 text-xl font-bold text-white">{activeScenario.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{activeScenario.detail}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-300">What You Get</p>
              <p className="mt-3 text-xl font-bold text-white">Benchmark-style decision support</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Score the opportunity, compare operating pressure, and move into a recommended service path.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-300">Advisory Output</p>
              <p className="mt-3 text-xl font-bold text-white">From estimate to next action</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Translate baseline inputs into savings value, carbon impact, and a consultant-ready next step.</p>
            </div>
            </div>
          )}
        </div>
      </div>

      <div className={`relative z-20 mx-auto -mt-10 px-4 ${isLoggedIn ? 'max-w-[1320px]' : 'max-w-4xl'}`}>
        <div className="grid gap-8">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
            <div className="border-b border-slate-100 px-6 py-6 sm:px-8 lg:px-10">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Calculator className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-black text-slate-900">Build Your ESG Business Case</h2>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                    {isLoggedIn
                      ? 'Add your logistics and emissions baseline, then shape the estimate with practical operating context.'
                      : 'Add your logistics and emissions baseline to estimate optimization potential and carbon reduction.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              {error && (
                <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {!isLoggedIn && result && (
                <div className="mb-10 rounded-3xl border border-slate-200 bg-slate-900 p-6 sm:p-8 shadow-inner">
                  <h2 className="text-center text-xl font-bold text-white sm:text-2xl">Estimated Value Creation</h2>
                  <div className="mt-6 grid grid-cols-1 gap-6 text-center sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-800 p-6">
                      <span className="mb-3 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Optimization Potential</span>
                      <span className="text-3xl font-extrabold text-emerald-400 sm:text-4xl">{formatCurrency(result.optimizationPotential)}</span>
                    </div>
                    <div className="rounded-2xl bg-slate-800 p-6">
                      <span className="mb-3 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Carbon Reduction</span>
                      <span className="text-3xl font-extrabold text-blue-400 sm:text-4xl">
                        {Number(result.carbonReduction).toLocaleString()} Tons
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <form className="space-y-9" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-900">Monthly Logistics Spend</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        min="0"
                        name="logisticsSpend"
                        value={formData.logisticsSpend}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-9 pr-4 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="500000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-900">Annual Carbon Waste</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        name="carbonWaste"
                        value={formData.carbonWaste}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pr-20 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        placeholder="12000"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">tons</span>
                    </div>
                  </div>
                </div>

                {isLoggedIn && (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-bold text-slate-900">Scenario Mode</p>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {scenarioOptions.map((option) => {
                      const active = formData.scenario === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData((current) => ({ ...current, scenario: option.value }))}
                          className={`rounded-2xl border px-4 py-4 text-left transition ${
                            active
                              ? 'border-blue-200 bg-white shadow-md shadow-blue-100/70'
                              : 'border-slate-200 bg-white/70 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-black text-slate-900">{option.label}</span>
                            {active && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-500">{option.detail}</p>
                        </button>
                      );
                    })}
                  </div>
                  </div>
                )}

                {isLoggedIn && (
                  <div className="grid gap-6 lg:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-900">Industry Profile</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      {industryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-900">Primary Network Mode</label>
                    <select
                      name="transportMode"
                      value={formData.transportMode}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      {transportOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-900">Supplier Complexity</label>
                    <select
                      name="supplierComplexity"
                      value={formData.supplierComplexity}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      {complexityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  {loading ? (isLoggedIn ? 'Running Diagnostic...' : 'Calculating...') : (isLoggedIn ? 'Calculate ESG Opportunity' : 'Calculate ROI')}
                </button>
              </form>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:px-8 lg:px-10">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
              <p className="text-sm leading-6 text-slate-500">
                {isLoggedIn
                  ? 'This calculator uses scenario-based assumptions to estimate savings and emissions improvement. Use it as a commercial diagnostic, not an audited sustainability statement.'
                  : 'Optimization potential is based on our average 15% reduction in logistics expenditure via network consolidation. Carbon reduction is based on our standard 20% Scope 3 mitigation strategy.'}
              </p>
            </div>
          </div>

          {!isLoggedIn && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Gauge className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-slate-900">Unlock Detailed ESG Diagnostics</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Sign in to access scenario modelling, benchmark-style opportunity scoring, recommended services, and next-step diagnostics.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Sign In for Detailed View
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-lg shadow-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Gauge className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-slate-900">Diagnostic Intelligence</h2>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">A smart view of where the strongest ESG and operating value is likely to sit.</p>
                </div>
              </div>

              {!result ? (
                <div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 sm:p-7">
                  <p className="text-sm font-semibold text-slate-600">Run the model to unlock:</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Opportunity Score</p>
                      <p className="mt-2 text-lg font-black text-slate-900">Benchmark-style readiness</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Recommended Service</p>
                      <p className="mt-2 text-lg font-black text-slate-900">A clear consulting path</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Benchmark Status</p>
                      <p className="mt-2 text-lg font-black text-slate-900">See if pressure is rising</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Next Step</p>
                      <p className="mt-2 text-lg font-black text-slate-900">Know what to do next</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-7 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {insightCards.map((card) => (
                      <div
                        key={card.label}
                        className={`rounded-2xl border p-5 min-w-0 ${toneClasses[card.tone]}`}
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-70 break-words">{card.label}</p>
                        <p className="mt-3 text-2xl font-black break-words">{card.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl bg-slate-950 p-6 sm:p-7 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-300">Lead Recommendation</p>
                        <h3 className="mt-3 text-2xl font-black">{result.recommendedService}</h3>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{result.nextStep}</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 px-4 py-3 text-left sm:text-right">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">Impact</p>
                        <p className="mt-2 text-lg font-black">{result.impactLevel}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Benchmark Status</p>
                        <p className="mt-2 text-lg font-black">{result.benchmarkStatus}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">ROI Tier</p>
                        <p className="mt-2 text-lg font-black">{result.roiTier}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Model Assumption</p>
                        <p className="mt-2 text-lg font-black">{result.assumptions?.scenario}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-emerald-600" />
                        <p className="text-sm font-bold text-slate-900">Model Drivers</p>
                      </div>
                      <ul className="mt-4 space-y-3 text-sm text-slate-600">
                        <li className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                          <span>Logistics optimization rate</span>
                          <span className="font-black text-slate-900">{result.assumptions?.logisticsRate}</span>
                        </li>
                        <li className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                          <span>Carbon reduction rate</span>
                          <span className="font-black text-slate-900">{result.assumptions?.carbonRate}</span>
                        </li>
                        <li className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                          <span>Saved to client dashboard</span>
                          <span className="font-black text-slate-900">{result.savedToDashboard ? 'Yes' : 'Guest run'}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-blue-50 p-5 sm:p-6">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-bold text-slate-900">Recommended Next Actions</p>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Recommended Service</p>
                          <p className="mt-2 text-lg font-black text-slate-900">{result.recommendedService}</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Next Step</p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{result.nextStep}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.message && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                      {result.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ESGCalculator;
