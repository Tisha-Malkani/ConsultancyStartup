import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../api/api.js';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', adminCode: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '', role: 'user', adminCode: '' });
    setShowPassword(false);
  };

  const validate = () => {
    if (!formData.email || !formData.password) return 'Email and password are required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (!isLogin && !formData.name.trim()) return 'Full name is required.';
    if (!isLogin && formData.role === 'admin' && !formData.adminCode.trim()) return 'Admin invite code is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let data;
      if (isLogin) {
        const res = await loginUser({ email: formData.email, password: formData.password });
        data = res.data;
      } else {
        const res = await registerUser(formData);
        data = res.data;
        setSuccess(`Welcome, ${data.name}! Account created. Redirecting…`);
        await new Promise((r) => setTimeout(r, 1500));
      }

      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg?.includes('already exists')) setError('An account with this email already exists. Please sign in.');
      else if (err.response?.status === 401) setError('Invalid email or password. Please try again.');
      else setError(msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* ── Brand Panel ── */}
      <div className="md:w-1/2 bg-slate-900 relative overflow-hidden flex flex-col justify-center p-8 sm:p-12 text-white min-h-[280px] md:min-h-screen">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold text-sm mb-10 transition-colors">
            ← Back to NovaConsult
          </Link>

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/60 text-blue-400 font-semibold text-xs mb-8 border border-slate-700 uppercase tracking-wider">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Client & Consultant Portal
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            Operational <span className="text-blue-400">Excellence</span> Awaits.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            Clients track transformation performance, while NovaConsult consultants manage diagnostics, workstreams, actions, and documents.
          </p>

          {/* Feature bullets */}
          <ul className="space-y-3">
            {[
              'Real-time supply chain KPI tracking',
              'Role-based client and consultant access',
              'Six Sigma DMAIC project roadmap',
              'ESG compliance dashboards',
              'Vendor performance analytics',
            ].map((item) => (
              <li key={item} className="flex items-center text-slate-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 mr-3 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white min-h-[70vh] md:min-h-screen">
        <div className="max-w-md w-full">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Sign in to access your secure dashboard.' : 'Register to begin your transformation journey.'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Name — signup only */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Priya Sharma"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'user', label: 'Client' },
                      { value: 'admin', label: 'Consultant' },
                    ].map((option) => (
                      <label key={option.value} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-bold transition-all ${formData.role === option.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={formData.role === option.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
                {formData.role === 'admin' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Admin Invite Code</label>
                    <input
                      type="text"
                      name="adminCode"
                      value={formData.adminCode}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Provided by NovaConsult"
                      autoComplete="off"
                    />
                    <p className="text-xs text-slate-400 mt-1.5">Demo default: NOVA-ADMIN-2026 unless changed in backend .env.</p>
                  </div>
                )}
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="name@company.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                {isLogin && (
                  <span className="text-xs text-blue-600 cursor-pointer hover:underline">Forgot password?</span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                  placeholder="Minimum 6 characters"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-slate-400 mt-1.5">Must be at least 6 characters.</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 text-base flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  {isLogin ? 'Signing In…' : 'Creating Account…'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-slate-400 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Switch mode */}
          <p className="text-center text-slate-500 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={switchMode}
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
