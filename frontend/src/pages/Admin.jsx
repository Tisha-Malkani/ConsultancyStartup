import { useEffect, useState } from 'react';
import { Activity, Briefcase, CheckCircle2, FileText, Plus, RefreshCw, Users } from 'lucide-react';
import { createEngagement, fetchAdminOverview } from '../api/api.js';

const Admin = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    company: '',
    programmeHealth: 'On Track',
    riskLevel: 'Medium',
    opportunity: 'High',
    recommendedService: 'Supply Chain Optimization',
    nextStep: 'Run diagnostic workshop',
  });

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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    setError('');
    try {
      await createEngagement(formData);
      setStatus('Client engagement created. The matching client can now see it in their dashboard.');
      setFormData({
        clientName: '',
        clientEmail: '',
        company: '',
        programmeHealth: 'On Track',
        riskLevel: 'Medium',
        opportunity: 'High',
        recommendedService: 'Supply Chain Optimization',
        nextStep: 'Run diagnostic workshop',
      });
      await loadOverview();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create engagement.');
    } finally {
      setSaving(false);
    }
  };

  const kpis = overview?.kpis || { clients: 0, bookings: 0, esgRuns: 0, engagements: 0 };

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4 font-semibold">{error}</div>}
        {status && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4 font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> {status}</div>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Client Users', value: kpis.clients, icon: <Users className="w-6 h-6" /> },
            { label: 'Consultation Requests', value: kpis.bookings, icon: <Briefcase className="w-6 h-6" /> },
            { label: 'ESG Runs', value: kpis.esgRuns, icon: <Activity className="w-6 h-6" /> },
            { label: 'Engagements', value: kpis.engagements, icon: <FileText className="w-6 h-6" /> },
          ].map((item) => (
            <div key={item.label} className="premium-card rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">{item.icon}</div>
              <div>
                <p className="text-slate-500 text-sm font-semibold">{item.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <section className="premium-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Plus className="w-5 h-5" /></div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Create Client Engagement</h2>
                <p className="text-sm text-slate-500">Use the same email as the client account.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Client Name</label>
                  <input name="clientName" value={formData.clientName} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Priya Sharma" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Client Email</label>
                  <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="client@company.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
                <input name="company" value={formData.company} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Company name" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Risk Level</label>
                  <select name="riskLevel" value={formData.riskLevel} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Opportunity</label>
                  <select name="opportunity" value={formData.opportunity} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Recommended Service</label>
                <select name="recommendedService" value={formData.recommendedService} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Supply Chain Optimization</option>
                  <option>Vendor Development</option>
                  <option>Procurement Strategy</option>
                  <option>Six Sigma Process Excellence</option>
                  <option>ESG Scope 3 Baseline</option>
                  <option>Inventory Optimization</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Next Step</label>
                <input name="nextStep" value={formData.nextStep} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <button disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-xl transition-colors">
                {saving ? 'Creating Engagement...' : 'Create Engagement'}
              </button>
            </form>
          </section>

          <section className="premium-card rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Active Engagements</h2>
              <p className="text-sm text-slate-500 mt-1">Records created by NovaConsult consultants.</p>
            </div>
            {loading ? (
              <div className="p-8 text-slate-500 font-semibold">Loading admin data...</div>
            ) : overview?.engagements?.length ? (
              <div className="divide-y divide-slate-100">
                {overview.engagements.map((engagement) => (
                  <div key={engagement._id} className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h3 className="font-black text-slate-900">{engagement.clientName}</h3>
                        <p className="text-sm text-slate-500 mt-1">{engagement.company || 'No company added'} | {engagement.clientEmail}</p>
                      </div>
                      <span className="self-start bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black px-3 py-1 rounded-full">{engagement.programmeHealth}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500 font-bold uppercase">Risk</p>
                        <p className="font-black text-slate-900">{engagement.diagnostic?.riskLevel}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500 font-bold uppercase">Opportunity</p>
                        <p className="font-black text-slate-900">{engagement.diagnostic?.opportunity}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500 font-bold uppercase">Workstreams</p>
                        <p className="font-black text-slate-900">{engagement.workstreams?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-slate-500 font-semibold">No engagements yet.</div>
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
      </main>
    </div>
  );
};

export default Admin;
