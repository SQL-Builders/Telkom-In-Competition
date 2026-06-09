import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { appPaths } from '../data/paths';
import { authApi } from '../api/authApi';


/* ─── Keyframes injected once ─── */
const STYLES = `
  @keyframes floatUp   { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-12px)} }
  @keyframes floatUpB  { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-18px)} }
  @keyframes rotateSlow{ from{transform:rotate(0deg)}        to{transform:rotate(360deg)}     }
  @keyframes rotateCCW { from{transform:rotate(0deg)}        to{transform:rotate(-360deg)}    }
  @keyframes blink     { 0%,100%{opacity:.2} 50%{opacity:.7}                                 }
  @keyframes waveScroll{ 0%{transform:translateX(0)}         100%{transform:translateX(-50%)} }
  @keyframes fadeSlide { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,16,46,0)} 50%{box-shadow:0 0 0 8px rgba(200,16,46,.12)} }
`;

/* ─── Background Component ─── */
function TelkomBg() {
  return (
    <>
      <style>{STYLES}</style>

      {/* Base gradient — deep dark red, Telkom identity */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
          background: 'linear-gradient(150deg, #0e0004 0%, #1e0009 40%, #140006 70%, #080002 100%)',
        }}
      >
        {/* ── Subtle dot grid ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(200,16,46,.14) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          animation: 'blink 6s ease-in-out infinite',
        }} />

        {/* ── Ambient glow orbs ── */}
        <div style={{
          position: 'absolute', width: 480, height: 480, top: -160, right: -120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,16,46,.18) 0%, transparent 65%)',
          animation: 'blink 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 320, height: 320, bottom: -80, left: -80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,16,46,.12) 0%, transparent 65%)',
          animation: 'blink 10s ease-in-out infinite 2s',
        }} />

        {/* ── Trophy / medal icon floating — top left ── */}
        <div style={{
          position: 'absolute', top: '8%', left: '5%',
          animation: 'floatUp 5s ease-in-out infinite',
          opacity: .18,
        }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M32 6 L20 6 L16 20 Q16 38 32 46 Q48 38 48 20 L44 6 Z"
              stroke="#C8102E" strokeWidth="2" fill="rgba(200,16,46,.08)" strokeLinejoin="round"/>
            <path d="M24 46 L24 54 M40 46 L40 54 M20 54 L44 54"
              stroke="#C8102E" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 12 L6 12 Q6 26 18 32" stroke="#C8102E" strokeWidth="2"
              strokeLinecap="round" fill="none"/>
            <path d="M48 12 L58 12 Q58 26 46 32" stroke="#C8102E" strokeWidth="2"
              strokeLinecap="round" fill="none"/>
            <circle cx="32" cy="26" r="5" stroke="#C8102E" strokeWidth="1.5" fill="rgba(200,16,46,.15)"/>
          </svg>
        </div>

        {/* ── Medal icon — bottom right ── */}
        <div style={{
          position: 'absolute', bottom: '12%', right: '5%',
          animation: 'floatUpB 6s ease-in-out infinite 1s',
          opacity: .15,
        }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="32" r="16" stroke="#C8102E" strokeWidth="2" fill="rgba(200,16,46,.08)"/>
            <circle cx="26" cy="32" r="10" stroke="#C8102E" strokeWidth="1" fill="none" strokeDasharray="3 3"/>
            <path d="M18 20 L26 4 L34 20" stroke="#C8102E" strokeWidth="2"
              strokeLinejoin="round" fill="rgba(200,16,46,.1)"/>
            <text x="26" y="36" textAnchor="middle" fill="#C8102E" fontSize="10" fontWeight="600">1st</text>
          </svg>
        </div>

        {/* ── Star shapes — scattered ── */}
        {[
          { top: '20%', left: '12%', size: 18, delay: '0s',   dur: '4s'  },
          { top: '14%', right: '20%', size: 14, delay: '1s',  dur: '5s'  },
          { top: '65%', left: '8%',  size: 12, delay: '2s',   dur: '6s'  },
          { top: '50%', right: '8%', size: 20, delay: '0.5s', dur: '4.5s'},
          { top: '80%', left: '35%', size: 10, delay: '1.5s', dur: '5.5s'},
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', ...s,
            animation: `floatUp ${s.dur} ease-in-out infinite ${s.delay}`,
            opacity: .22,
          }}>
            <svg width={s.size} height={s.size} viewBox="0 0 20 20" fill="none">
              <polygon points="10,1 12.4,7.2 19,7.6 14,12 15.8,19 10,15.4 4.2,19 6,12 1,7.6 7.6,7.2"
                fill="rgba(200,16,46,.6)" stroke="#C8102E" strokeWidth="1"/>
            </svg>
          </div>
        ))}

        {/* ── Concentric ring (center-right) — competition arena feel ── */}
        <div style={{
          position: 'absolute', top: '25%', right: '3%',
          width: 140, height: 140,
          border: '1px solid rgba(200,16,46,.2)',
          borderRadius: '50%',
          animation: 'rotateSlow 30s linear infinite',
        }}>
          <div style={{
            position: 'absolute', inset: 18,
            border: '1px dashed rgba(200,16,46,.15)',
            borderRadius: '50%',
            animation: 'rotateCCW 20s linear infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 36,
            border: '1px solid rgba(200,16,46,.1)',
            borderRadius: '50%',
          }} />
        </div>

        {/* ── Small ring — bottom left ── */}
        <div style={{
          position: 'absolute', bottom: '22%', left: '4%',
          width: 90, height: 90,
          border: '1px solid rgba(200,16,46,.18)',
          borderRadius: '50%',
          animation: 'rotateCCW 24s linear infinite',
        }}>
          <div style={{
            position: 'absolute', inset: 14,
            border: '1px dashed rgba(200,16,46,.12)',
            borderRadius: '50%',
          }} />
        </div>

        {/* ── Laurel / bracket lines — left decoration ── */}
        <div style={{
          position: 'absolute', top: '38%', left: '2%',
          animation: 'floatUpB 7s ease-in-out infinite 0.5s',
          opacity: .18,
        }}>
          <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
            <path d="M30 5 Q5 15 5 40 Q5 65 30 75" stroke="#C8102E" strokeWidth="1.5"
              strokeLinecap="round" fill="none"/>
            <circle cx="5" cy="40" r="3" fill="rgba(200,16,46,.5)"/>
          </svg>
        </div>
        <div style={{
          position: 'absolute', top: '38%', right: '2%',
          animation: 'floatUpB 7s ease-in-out infinite 1.5s',
          opacity: .18,
        }}>
          <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
            <path d="M10 5 Q35 15 35 40 Q35 65 10 75" stroke="#C8102E" strokeWidth="1.5"
              strokeLinecap="round" fill="none"/>
            <circle cx="35" cy="40" r="3" fill="rgba(200,16,46,.5)"/>
          </svg>
        </div>

        {/* ── Horizontal accent line ── */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(200,16,46,.12), transparent)',
        }} />

        {/* ── Wave bottom ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '200%',
          animation: 'waveScroll 18s linear infinite',
        }}>
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none"
            style={{ width: '50%', height: 72, display: 'inline-block' }}>
            <path d="M0,36 C240,12 480,60 720,36 C960,12 1200,60 1440,36 L1440,72 L0,72 Z"
              fill="rgba(200,16,46,.07)"/>
            <path d="M0,52 C240,36 480,68 720,52 C960,36 1200,68 1440,52 L1440,72 L0,72 Z"
              fill="rgba(200,16,46,.05)"/>
          </svg>
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none"
            style={{ width: '50%', height: 72, display: 'inline-block' }}>
            <path d="M0,36 C240,12 480,60 720,36 C960,12 1200,60 1440,36 L1440,72 L0,72 Z"
              fill="rgba(200,16,46,.07)"/>
            <path d="M0,52 C240,36 480,68 720,52 C960,36 1200,68 1440,52 L1440,72 L0,72 Z"
              fill="rgba(200,16,46,.05)"/>
          </svg>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ─── */
export function LoginPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { login }  = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [errors, setErrors]             = useState<{ email?: string; password?: string; form?: string }>({});
  const [isLoading, setIsLoading]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string; form?: string } = {};

    if (!formData.email)
      newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';

    if (!formData.password)
      newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      const res = await authApi.login(formData.email, formData.password);
      login(res.user, res.accessToken);
      const from = (location.state as any)?.from?.pathname || appPaths.dashboard;
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrors({ form: err.response?.data?.message || 'Invalid email or password' });
    } finally {
      setIsLoading(false);
    }
  };

  /* shared input class */
  const inputBase = (hasErr: boolean) =>
    `w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none transition-all text-white placeholder:text-white/25 border-2 ${
      hasErr
        ? 'border-red-500 focus:border-red-500'
        : 'border-white/10 focus:border-[#C8102E] focus:bg-[rgba(200,16,46,0.08)]'
    }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">

      {/* ── Animated background ── */}
      <TelkomBg />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-md">

        {/* Back button */}
        <button
          onClick={() => navigate(appPaths.home)}
          className="flex items-center gap-2 mb-8 transition-colors text-white/40 hover:text-[#C8102E]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </button>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
          className="rounded-2xl p-8"
        >
          {/* Brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {/* Container pembungkus gambar agar ukurannya konsisten (w-11 h-11) */}
            <div
              className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
              style={{ 
                animation: 'glowPulse 3s ease-in-out infinite',
                background: 'rgba(255,255,255,0.05)' // Opsional: beri sedikit background agar terlihat rapi
              }}
            >
              <img
                src="/assets/telyuuu.png"
                alt="Logo"
                className="w-full h-full object-contain p-1" // object-contain agar logo tidak terpotong, p-1 agar ada jarak ke tepi
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Telkom‑In‑<span className="text-[#C8102E]">Competition</span>
            </span>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-sm text-white/40">Login to access your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                {errors.form}
              </div>
            )}
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-2 tracking-widest uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: undefined });
                  }}
                  className={inputBase(!!errors.email)}
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-2 tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: undefined });
                  }}
                  className={`${inputBase(!!errors.password)} pr-12`}
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                 {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[#C8102E]"
                />
                <span className="text-sm text-white/40">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#C8102E] hover:underline font-semibold">
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 bg-[#C8102E] text-white font-bold rounded-xl transition-colors mt-2 flex justify-center items-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#A00D25]'
              }`}
              style={{ boxShadow: '0 4px 20px rgba(200,16,46,0.35)' }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/25">atau</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Footer links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-white/40">
              Belum punya akun?{' '}
              <button
                onClick={() => navigate(appPaths.register)}
                className="text-[#C8102E] hover:underline font-semibold"
              >
                Daftar di sini
              </button>
            </p>
            <p className="text-xs text-white/30">
              Login sebagai admin?{' '}
              <button
                onClick={() => navigate(appPaths.adminLogin)}
                className="text-[#C8102E] hover:underline font-semibold"
              >
                Admin Portal
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
