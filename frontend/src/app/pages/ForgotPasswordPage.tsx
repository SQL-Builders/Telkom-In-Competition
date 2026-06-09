import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle2, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { appPaths } from '../data/paths';
// @ts-ignore
import confetti from 'canvas-confetti';

/* ─── Keyframes & Custom Styles ─── */
const STYLES = `
  @keyframes floatUp   { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-12px)} }
  @keyframes floatUpB  { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-18px)} }
  @keyframes rotateSlow{ from{transform:rotate(0deg)}        to{transform:rotate(360deg)}     }
  @keyframes rotateCCW { from{transform:rotate(0deg)}        to{transform:rotate(-360deg)}    }
  @keyframes blink     { 0%,100%{opacity:.2} 50%{opacity:.7}                                 }
  @keyframes waveScroll{ 0%{transform:translateX(0)}         100%{transform:translateX(-50%)} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,16,46,0)} 50%{box-shadow:0 0 0 8px rgba(200,16,46,.12)} }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
`;

/* ─── Animated Background (matching LoginPage) ─── */
function TelkomBg() {
  return (
    <>
      <style>{STYLES}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
          background: 'linear-gradient(150deg, #0e0004 0%, #1e0009 40%, #140006 70%, #080002 100%)',
        }}
      >
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(200,16,46,.14) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          animation: 'blink 6s ease-in-out infinite',
        }} />

        {/* Ambient glow orbs */}
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

        {/* Trophy icon */}
        <div style={{ position: 'absolute', top: '8%', left: '5%', animation: 'floatUp 5s ease-in-out infinite', opacity: .18 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M32 6 L20 6 L16 20 Q16 38 32 46 Q48 38 48 20 L44 6 Z"
              stroke="#C8102E" strokeWidth="2" fill="rgba(200,16,46,.08)" strokeLinejoin="round"/>
            <path d="M24 46 L24 54 M40 46 L40 54 M20 54 L44 54"
              stroke="#C8102E" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 12 L6 12 Q6 26 18 32" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M48 12 L58 12 Q58 26 46 32" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="32" cy="26" r="5" stroke="#C8102E" strokeWidth="1.5" fill="rgba(200,16,46,.15)"/>
          </svg>
        </div>

        {/* Medal icon */}
        <div style={{ position: 'absolute', bottom: '12%', right: '5%', animation: 'floatUpB 6s ease-in-out infinite 1s', opacity: .15 }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="32" r="16" stroke="#C8102E" strokeWidth="2" fill="rgba(200,16,46,.08)"/>
            <circle cx="26" cy="32" r="10" stroke="#C8102E" strokeWidth="1" fill="none" strokeDasharray="3 3"/>
            <path d="M18 20 L26 4 L34 20" stroke="#C8102E" strokeWidth="2" strokeLinejoin="round" fill="rgba(200,16,46,.1)"/>
            <text x="26" y="36" textAnchor="middle" fill="#C8102E" fontSize="10" fontWeight="600">1st</text>
          </svg>
        </div>

        {/* Stars */}
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

        {/* Concentric rings */}
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
        </div>

        {/* Laurel brackets */}
        <div style={{ position: 'absolute', top: '38%', left: '2%', animation: 'floatUpB 7s ease-in-out infinite 0.5s', opacity: .18 }}>
          <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
            <path d="M30 5 Q5 15 5 40 Q5 65 30 75" stroke="#C8102E" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <circle cx="5" cy="40" r="3" fill="rgba(200,16,46,.5)"/>
          </svg>
        </div>
        <div style={{ position: 'absolute', top: '38%', right: '2%', animation: 'floatUpB 7s ease-in-out infinite 1.5s', opacity: .18 }}>
          <svg width="40" height="80" viewBox="0 0 40 80" fill="none">
            <path d="M10 5 Q35 15 35 40 Q35 65 10 75" stroke="#C8102E" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <circle cx="35" cy="40" r="3" fill="rgba(200,16,46,.5)"/>
          </svg>
        </div>

        {/* Wave bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '200%',
          animation: 'waveScroll 18s linear infinite',
        }}>
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none"
            style={{ width: '50%', height: 72, display: 'inline-block' }}>
            <path d="M0,36 C240,12 480,60 720,36 C960,12 1200,60 1440,36 L1440,72 L0,72 Z"
              fill="rgba(200,16,46,.07)"/>
          </svg>
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none"
            style={{ width: '50%', height: 72, display: 'inline-block' }}>
            <path d="M0,36 C240,12 480,60 720,36 C960,12 1200,60 1440,36 L1440,72 L0,72 Z"
              fill="rgba(200,16,46,.07)"/>
          </svg>
        </div>
      </div>
    </>
  );
}

/* ─── Main Component ─── */
export function ForgotPasswordPage() {
  const navigate = useNavigate();
  
  // Wizard steps: 'email' | 'otp' | 'reset' | 'success'
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email');
  
  // Form states
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP States
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(59);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [strength, setStrength] = useState<{ score: number; label: string; color: string; width: string }>({
    score: 0, label: 'Sangat Lemah', color: 'bg-red-500', width: '0%'
  });

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Measure password strength
  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: 'Belum diisi', color: 'bg-white/10', width: '0%' });
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = 'Lemah';
    let color = 'bg-red-500';
    let width = '20%';

    if (score >= 4) {
      label = 'Sangat Kuat 🔥';
      color = 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]';
      width = '100%';
    } else if (score >= 3) {
      label = 'Kuat';
      color = 'bg-green-500';
      width = '75%';
    } else if (score >= 2) {
      label = 'Sedang';
      color = 'bg-amber-500';
      width = '50%';
    }

    setStrength({ score, label, color, width });
  }, [password]);

  // Handle confetti burst on success
  useEffect(() => {
    if (step === 'success') {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#C8102E', '#ffffff', '#ffccd5']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#C8102E', '#ffffff', '#ffccd5']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [step]);

  // Step 1: Send OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Email wajib diisi');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Format email tidak valid');
      return;
    }

    setIsLoading(true);
    // Simulate sending email
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setTimer(59);
      setIsResendDisabled(true);
    }, 1200);
  };

  // Step 2: Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedData.forEach((char, idx) => {
        if (idx + index < 6 && /^[0-9]$/.test(char)) {
          newOtp[idx + index] = char;
        }
      });
      setOtp(newOtp);
      
      const nextIdx = Math.min(index + pastedData.length, 5);
      otpRefs.current[nextIdx]?.focus();
      return;
    }

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto trigger verification if full
    if (newOtp.every(char => char !== '') && index === 5) {
      verifyOtpCode(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtpCode = (code: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (code === '123456') {
        setStep('reset');
      } else {
        setOtpError('Kode OTP salah. Coba 123456');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    }, 1000);
  };

  const handleResendCode = () => {
    setIsResendDisabled(true);
    setTimer(59);
    setOtp(Array(6).fill(''));
    setOtpError('');
    // Simulate resending
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Step 3: Handle Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!password) {
      setPasswordError('Password baru wajib diisi');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password minimal 6 karakter');
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Password konfirmasi tidak cocok');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  // Shared input style
  const inputClass = (hasError: boolean) =>
    `w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none transition-all text-white placeholder:text-white/20 border-2 ${
      hasError
        ? 'border-red-500/80 focus:border-red-500 bg-red-500/5'
        : 'border-white/10 focus:border-[#C8102E] focus:bg-[rgba(200,16,46,0.06)] bg-white/[0.04]'
    }`;

  // Framer Motion variants for card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -24, scale: 0.98, transition: { duration: 0.3, ease: 'easeIn' as const } }
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.5 }
    },
    default: { x: 0 }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-[#0a0003]">
      {/* Background decorations */}
      <TelkomBg />

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        {step !== 'success' && (
          <button
            onClick={() => {
              if (step === 'email') navigate(appPaths.login);
              if (step === 'otp') setStep('email');
              if (step === 'reset') setStep('otp');
            }}
            className="flex items-center gap-2 mb-6 transition-colors text-white/40 hover:text-[#C8102E]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">
              {step === 'email' ? 'Kembali ke Login' : 'Kembali'}
            </span>
          </button>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: REQUEST OTP (EMAIL) */}
          {step === 'email' && (
            <motion.div
              key="email-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card rounded-2xl p-8"
            >
              {/* Brand Logo */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div
                  className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-white/5"
                  style={{ animation: 'glowPulse 3s ease-in-out infinite' }}
                >
                  <img
                    src="/assets/telyuuu.png"
                    alt="Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Telkom‑In‑<span className="text-[#C8102E]">Competition</span>
                </span>
              </div>

              {/* Title & Desc */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Lupa Password?</h1>
                <p className="text-sm text-white/40 px-2 leading-relaxed">
                  Masukkan email terdaftar Anda. Kami akan mengirimkan kode verifikasi untuk mereset sandi Anda.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2 tracking-widest uppercase">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      className={inputClass(!!emailError)}
                      placeholder="contoh.email@example.com"
                      disabled={isLoading}
                    />
                  </div>
                  {emailError && <p className="mt-2 text-xs text-red-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400 inline-block"/> {emailError}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors relative overflow-hidden flex items-center justify-center"
                  style={{ boxShadow: '0 4px 20px rgba(200,16,46,0.35)' }}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Mengirim Kode...</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Kirim Kode Verifikasi <Sparkles className="w-4 h-4" />
                    </span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 'otp' && (
            <motion.div
              key="otp-card"
              variants={{
                hidden: cardVariants.hidden,
                visible: cardVariants.visible,
                exit: cardVariants.exit,
                shake: shakeVariants.shake
              }}
              initial="hidden"
              animate={isShaking ? 'shake' : 'visible'}
              exit="exit"
              className="glass-card rounded-2xl p-8"
              style={{ x: 0 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 bg-[#C8102E]/10 border border-[#C8102E]/30 rounded-2xl flex items-center justify-center text-[#C8102E]">
                  <KeyRound className="w-7 h-7" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Verifikasi OTP</h1>
                <p className="text-sm text-white/40 leading-relaxed px-1">
                  Kami telah mengirimkan 6 digit kode keamanan ke <span className="text-white/80 font-medium">{email}</span>.
                </p>
                <div className="mt-3 px-3 py-1.5 rounded-lg bg-[#C8102E]/5 border border-[#C8102E]/10 inline-block">
                  <p className="text-xs text-[#C8102E] font-medium">
                    Demo Mode: Masukkan kode <span className="underline font-bold">123456</span>
                  </p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); verifyOtpCode(otp.join('')); }} className="space-y-6">
                {/* 6 Digit Grid */}
                <div className="flex justify-between gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6} // allow paste
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-12 h-14 rounded-xl text-center text-xl font-bold text-white focus:outline-none border-2 border-white/10 focus:border-[#C8102E] bg-white/[0.04] focus:bg-[rgba(200,16,46,0.06)] transition-all"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-center text-xs text-red-400 flex items-center justify-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400 inline-block" /> {otpError}
                  </p>
                )}

                {/* Resend & Countdown */}
                <div className="text-center">
                  {isResendDisabled ? (
                    <p className="text-xs text-white/30 font-medium">
                      Kirim ulang kode dalam <span className="text-white/70 font-semibold">{`00:${timer.toString().padStart(2, '0')}`}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-xs text-[#C8102E] hover:underline font-semibold flex items-center gap-1.5 mx-auto transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Kirim Ulang Kode OTP
                    </button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || otp.some(c => c === '')}
                  className="w-full py-3.5 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 4px 20px rgba(200,16,46,0.35)' }}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <span>Verifikasi Kode</span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 'reset' && (
            <motion.div
              key="reset-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 bg-[#C8102E]/10 border border-[#C8102E]/30 rounded-2xl flex items-center justify-center text-[#C8102E]">
                  <ShieldCheck className="w-7 h-7" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Password Baru</h1>
                <p className="text-sm text-white/40 leading-relaxed px-2">
                  Buat kata sandi baru yang kuat untuk melindungi akun Anda.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2 tracking-widest uppercase">
                    Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      className={`${inputClass(!!passwordError)} pr-12`}
                      placeholder="Masukkan password baru"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && <p className="mt-1.5 text-xs text-red-400">{passwordError}</p>}
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="space-y-2 py-1 px-0.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/30 font-medium">Kekuatan Sandi:</span>
                      <span className="font-semibold text-white/70">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-500 ease-out`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-[10px] text-white/30 leading-relaxed">
                      Saran: Gunakan minimal 8 karakter, huruf besar, angka, dan simbol.
                    </p>
                  </div>
                )}

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2 tracking-widest uppercase">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmPasswordError('');
                      }}
                      className={`${inputClass(!!confirmPasswordError)} pr-12`}
                      placeholder="Konfirmasi password baru"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPasswordError && <p className="mt-1.5 text-xs text-red-400">{confirmPasswordError}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#A00D25] transition-colors mt-3 flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 4px 20px rgba(200,16,46,0.35)' }}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Memperbarui Sandi...</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && (
            <motion.div
              key="success-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass-card rounded-2xl p-8 text-center"
            >
              {/* Pulsing Success Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>
              </div>

              {/* Title & Desc */}
              <h1 className="text-2xl font-bold text-white mb-3">Password Diperbarui!</h1>
              <p className="text-sm text-white/40 leading-relaxed mb-8 px-2">
                Kata sandi akun Anda telah sukses disetel ulang. Silakan masuk kembali dengan password baru Anda.
              </p>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(appPaths.login)}
                className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
              >
                Kembali ke Login
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
