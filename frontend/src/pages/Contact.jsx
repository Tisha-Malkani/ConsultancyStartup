import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Calendar, FileCheck2, ShieldCheck } from 'lucide-react';
import { createBooking } from '../api/api.js';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companySize: '1-50 Employees',
    interestArea: 'SCM & Logistics',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '', slot: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '', slot: '' });

    try {
      const res = await createBooking(formData);
      const slot = res.data?.slotFormatted || '';
      setStatus({
        type: 'success',
        message: 'Your consultation has been booked! Check your email for confirmation.',
        slot,
      });
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        companySize: '1-50 Employees', interestArea: 'SCM & Logistics', message: ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.request
          ? 'The booking service is temporarily unavailable. Please check that the backend is running, or email partnerships.novaconsult@gmail.com directly.'
          : error.response?.data?.error || 'Failed to send request. Please try again.',
        slot: ''
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Let's Build the <span className="text-blue-400">Future</span></h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">Schedule a complimentary strategy session with one of our senior partners to discuss your operational challenges.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-16 relative z-20 pb-24">
        <div className="premium-card rounded-3xl overflow-hidden max-w-5xl mx-auto flex flex-col lg:flex-row">
          
          {/* Contact Information Sidebar */}
          <div className="bg-slate-950 text-white p-10 lg:w-2/5 flex flex-col justify-between border-r border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              <p className="text-slate-400 mb-10 leading-relaxed">
                Fill up the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0" />
                  <span className="text-slate-300">+91 (22) 1234-5678</span>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0" />
                  <span className="text-slate-300">partnerships.novaconsult@gmail.com</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0" />
                  <span className="text-slate-300">Unit 1205, Tower A, Business Park<br/>Bandra Kurla Complex, Mumbai, MH 400051</span>
                </div>
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0" />
                  <span className="text-slate-300">Mon-Fri: 9:00 AM - 6:00 PM IST</span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-800 space-y-5">
                <div className="flex items-start">
                  <FileCheck2 className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm">NovaConsult Advisory LLP</p>
                    <p className="text-slate-400 text-sm mt-1">Business identity and engagement documents available during onboarding.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ShieldCheck className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm">Confidentiality-first engagement</p>
                    <p className="text-slate-400 text-sm mt-1">NDA, SOW, and data-handling terms issued before diagnostic work.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="p-10 lg:w-3/5">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Book a Consultation</h3>
            
            {status.message && (
              <div className={`mb-6 rounded-xl border ${
                status.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className={`p-4 flex items-start gap-3 ${
                  status.type === 'success' ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {status.type === 'success'
                    ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    : <span className="text-red-500 font-bold flex-shrink-0">✕</span>
                  }
                  <span className="font-semibold text-sm">{status.message}</span>
                </div>
                {status.slot && (
                  <div className="border-t border-emerald-200 px-4 py-3 flex items-center gap-3 bg-emerald-100/50 rounded-b-xl">
                    <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide">Your scheduled slot</p>
                      <p className="text-emerald-800 font-bold text-sm">{status.slot}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Doe" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="+91 (XX) XXXX-XXXX" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Company Size</label>
                  <select name="companySize" value={formData.companySize} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none">
                    <option>1-50 Employees</option>
                    <option>51-200 Employees</option>
                    <option>201-1000 Employees</option>
                    <option>1000+ Employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Pain Point</label>
                  <select name="interestArea" value={formData.interestArea} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none">
                    <option>SCM & Logistics (OTIF)</option>
                    <option>Six Sigma (Defect Reduction)</option>
                    <option>ESG (Scope 3 Reporting)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none" placeholder="Briefly describe your current challenges..."></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 text-lg">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
