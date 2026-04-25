import { useState } from 'react';
import { Calculator, BarChart3, Info } from 'lucide-react';
import { calculateESG } from '../api/api.js';

const ESGCalculator = () => {
  const [formData, setFormData] = useState({ logisticsSpend: '', carbonWaste: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await calculateESG(formData);
      setResult(data);
    } catch (err) {
      setError(err.request
        ? 'The calculator service is temporarily unavailable. Please check that the backend is running, or try again shortly.'
        : err.response?.data?.error || 'Failed to calculate metrics.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-slate-900 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-400 mb-6 mx-auto">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Performance & <span className="text-blue-400">ESG ROI</span> Calculator
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Enter your baseline metrics to instantly see your optimization potential and carbon reduction impact.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="p-6 sm:p-10">
            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl">{error}</div>
            )}

            {result && (
              <div className="mb-10 p-6 sm:p-8 bg-slate-900 border border-slate-700 rounded-2xl shadow-inner">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Estimated Value Creation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                  <div className="bg-slate-800 rounded-2xl p-6">
                    <span className="block text-xs text-slate-400 font-bold mb-3 uppercase tracking-widest">Optimization Potential (15%)</span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">{formatCurrency(result.optimizationPotential)}</span>
                  </div>
                  <div className="bg-slate-800 rounded-2xl p-6">
                    <span className="block text-xs text-slate-400 font-bold mb-3 uppercase tracking-widest">Carbon Reduction (20%)</span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-blue-400">{result.carbonReduction} Tons</span>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Monthly Logistics Spend ($)</label>
                  <input
                    type="number" name="logisticsSpend" value={formData.logisticsSpend}
                    onChange={handleChange} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. 500000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Annual Carbon Waste (Tons)</label>
                  <input
                    type="number" name="carbonWaste" value={formData.carbonWaste}
                    onChange={handleChange} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. 12000"
                  />
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 sm:py-5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex justify-center items-center text-lg"
              >
                <Calculator className="mr-2 w-6 h-6" />
                {loading ? 'Calculating...' : 'Calculate ROI'}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 p-5 sm:p-6 border-t border-slate-100 flex items-start">
            <Info className="w-5 h-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-slate-500 leading-relaxed">
              * Optimization Potential is based on our average 15% reduction in logistics expenditure via network consolidation. Carbon Reduction is based on our standard 20% Scope 3 mitigation strategy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGCalculator;
