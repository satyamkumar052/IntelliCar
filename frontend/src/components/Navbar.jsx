import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Car, LogOut, Menu } from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.info('Logged out successfully.');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <nav className="fixed top-0 w-full z-50 h-[60px] flex items-center px-7 bg-[#0b0e14]/90 backdrop-blur-xl border-b border-white/[0.06] relative
      after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px
      after:bg-gradient-to-r after:from-transparent after:via-sky-400/40 after:to-transparent">

      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <div className="w-8 h-8 rounded-lg bg-sky-400/10 border border-sky-400/25 flex items-center justify-center group-hover:bg-sky-400/20 transition-colors">
            <Car size={16} color="#38bdf8" strokeWidth={2} />
          </div>
          <span className="font-['Barlow_Condensed'] font-bold text-xl tracking-widest text-sky-400 leading-none">
            INTELLI<span className="text-slate-100">CAR</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {user ? (
            <>
              {[
                ['/dashboard', 'DASHBOARD'],
                ['/my-cars', 'MY CARS'],
                ['/documents', 'DOCS'],
                ['/recommend', 'AI MATCH'],
                ['/location', 'LOCATOR'],
                ['/chatbot', 'CHAT'],
                ['/payments', 'PAYMENTS'],
                ['/forum', 'FORUM'],
                ['/profile', 'PROFILE'],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="font-['Barlow_Condensed'] text-[13px] font-semibold tracking-widest text-slate-400 hover:text-slate-100 hover:bg-white/5 px-2.5 py-1.5 rounded-md transition-all"
                >
                  {label}
                </Link>
              ))}

              <div className="w-px h-[18px] bg-white/10 mx-2" />

              {/* User pill */}
              <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full py-1 pl-1.5 pr-3">
                <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-[11px] font-semibold text-white">
                  {initials}
                </div>
                <span className="text-[13px] text-slate-300">{user.name.split(' ')[0]}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 font-['Barlow_Condensed'] text-xs font-semibold tracking-widest text-slate-500 hover:text-red-400 hover:bg-red-400/[0.07] px-2.5 py-1.5 rounded-md transition-all ml-1"
              >
                <LogOut size={13} />
                EXIT
              </button>
            </>
          ) : (
            <>
              <a href="/#features" className="font-['Barlow_Condensed'] text-[13px] font-semibold tracking-widest text-slate-400 hover:text-slate-100 hover:bg-white/5 px-2.5 py-1.5 rounded-md transition-all">
                FEATURES
              </a>
              <a href="/#technology" className="font-['Barlow_Condensed'] text-[13px] font-semibold tracking-widest text-slate-400 hover:text-slate-100 hover:bg-white/5 px-2.5 py-1.5 rounded-md transition-all">
                TECHNOLOGY
              </a>

              <div className="w-px h-[18px] bg-white/10 mx-2" />

              <Link
                to="/login"
                className="font-['Barlow_Condensed'] text-[13px] font-semibold tracking-widest text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-100 px-3.5 py-1.5 rounded-lg transition-all"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="font-['Barlow_Condensed'] text-[13px] font-bold tracking-widest text-[#0b0e14] bg-sky-400 hover:bg-sky-300 px-4 py-1.5 rounded-lg ml-1 transition-colors"
              >
                GET STARTED
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-slate-400 hover:text-white p-1 transition-colors">
          <Menu size={22} />
        </button>

      </div>
    </nav>
  );
};

export default Navbar;