import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getUserInfo = () => {
    try { return JSON.parse(localStorage.getItem('userInfo')); }
    catch { return null; }
  };
  const userInfo = getUserInfo();
  const portalPath = userInfo?.role === 'admin' ? '/admin' : '/dashboard';

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/auth');
    window.location.reload();
  };

  const close = () => setIsOpen(false);

  // Returns desktop link classes — blue + underline indicator for active
  const navLink = (path) => {
    const isActive = location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path));
    return isActive
      ? 'text-blue-600 font-bold text-sm relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-blue-600'
      : 'text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm';
  };

  // Returns mobile link classes
  const mobileLink = (path) => {
    const isActive = location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path));
    return isActive
      ? 'block px-4 py-3 text-base font-bold text-blue-600 bg-blue-50 rounded-xl'
      : 'block px-4 py-3 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors';
  };

  return (
    <nav className="bg-white/88 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/70 shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center gap-3 flex-shrink-0">
            <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white grid place-items-center shadow-lg shadow-slate-900/20">
              <span className="text-sm font-black text-blue-300">NC</span>
            </span>
            <span className="leading-tight">
              <span className="block text-xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 bg-clip-text text-transparent">NovaConsult</span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.22em] font-bold text-slate-400">Advisory LLP</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/about" className={navLink('/about')}>About</Link>
            <Link to="/services" className={navLink('/services')}>Services</Link>
            <Link to="/industry-solutions" className={navLink('/industry-solutions')}>Industries</Link>
            <Link to="/case-studies" className={navLink('/case-studies')}>Case Studies</Link>
            <Link to="/blogs" className={navLink('/blogs')}>Insights</Link>
            <Link to="/esg-calculator" className={navLink('/esg-calculator')}>ESG</Link>

            {userInfo ? (
              <>
                <Link to={portalPath} className={navLink(portalPath)}>{userInfo.role === 'admin' ? 'Admin' : 'Portal'}</Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 flex items-center font-medium transition-colors text-sm">
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className={navLink('/auth')}>Login</Link>
            )}

            <Link
              to="/contact"
              className={`px-5 py-2.5 rounded-full font-semibold transition-all shadow-md flex items-center text-sm whitespace-nowrap ${
                location.pathname === '/contact'
                  ? 'bg-slate-900 text-white shadow-slate-900/20'
                  : 'bg-slate-900 hover:bg-blue-700 text-white shadow-slate-900/20 hover:shadow-blue-500/25'
              }`}
            >
              Let's Talk <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-1 shadow-xl">
          <Link to="/about" onClick={close} className={mobileLink('/about')}>About Us</Link>
          <Link to="/services" onClick={close} className={mobileLink('/services')}>Services</Link>
          <Link to="/industry-solutions" onClick={close} className={mobileLink('/industry-solutions')}>Industries</Link>
          <Link to="/case-studies" onClick={close} className={mobileLink('/case-studies')}>Case Studies</Link>
          <Link to="/blogs" onClick={close} className={mobileLink('/blogs')}>Insights</Link>
          <Link to="/esg-calculator" onClick={close} className={mobileLink('/esg-calculator')}>ESG Calculator</Link>

          {userInfo ? (
            <>
              <Link to={portalPath} onClick={close} className={mobileLink(portalPath)}>{userInfo.role === 'admin' ? 'Admin Workspace' : 'Client Portal'}</Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-base font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={close} className={mobileLink('/auth')}>Login</Link>
          )}

          <div className="pt-3">
            <Link
              to="/contact"
              onClick={close}
              className={`flex items-center justify-center font-bold px-6 py-3 rounded-xl transition-all shadow-md ${
                location.pathname === '/contact'
                  ? 'bg-blue-700 text-white shadow-blue-600/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              Let's Talk <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
