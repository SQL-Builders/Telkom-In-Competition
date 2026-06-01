import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { appPaths } from '../data/paths';

// Note: This is a simplified admin login page for demonstration purposes. In a real application, you would want to implement proper authentication and security measures.s

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Login as admin generic (in real app, call API here and validate credentials)
    login({
      id: Date.now(),
      name: 'Admin Telkom',
      email: formData.email,
      role: 'admin',
    });
    navigate(appPaths.adminDashboard);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-[#C8102E] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(appPaths.home)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            {/* <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-[#C8102E]" />
            </div> */}
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
            <span className="text-2xl font-bold text-white">
              Admin Portal
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-white/70">Login sebagai Admin Telkom University</p>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-100 text-center">
              🔒 Area khusus admin kampus untuk mengelola lomba
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email Admin
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/10 border-2 backdrop-blur-sm text-white placeholder:text-white/50 rounded-xl focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-white/20 focus:border-white/50'
                  }`}
                  placeholder="admin@telkomuniversity.ac.id"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: undefined });
                  }}
                  className={`w-full pl-12 pr-12 py-3.5 bg-white/10 border-2 backdrop-blur-sm text-white placeholder:text-white/50 rounded-xl focus:outline-none transition-colors ${
                    errors.password
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-white/20 focus:border-white/50'
                  }`}
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-300">{errors.password}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-white text-[#C8102E] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Login as Admin
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Bukan admin?{' '}
              <button
                onClick={() => navigate(appPaths.login)}
                className="text-white hover:underline font-semibold"
              >
                Login sebagai Mahasiswa
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
