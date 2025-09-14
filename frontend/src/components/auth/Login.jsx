import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api';

export default function Login({ onSwitch, onSuccess, embedded = false }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // Forgot password flow removed

  // Forgot password URL token handling removed

  const validate = () => {
    let ok = true;
    const e = email.trim();
    const p = password;
    setEmailError('');
    setPasswordError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setEmailError('Enter a valid email');
      ok = false;
    }
    if (!p) {
      setPasswordError('Password is required');
      ok = false;
    }
    return ok;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email.trim(), password, rememberMe);
    setLoading(false);
    if (res.ok) {
      if (onSuccess) onSuccess();
    }
    else setError(res.error || 'Login failed');
  };

  // Forgot/reset handlers removed


  if (embedded) {
    return (
      <>
        {error && <div className="auth-error">{error}</div>}

        {/* Email Input */}
        <div className="form-group">
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              autoComplete="off"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
            />
          </div>
          {emailError && <div className="auth-error">{emailError}</div>}
        </div>

        {/* Password Input */}
        <div className="form-group">
          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {passwordError && <div className="auth-error">{passwordError}</div>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="checkmark"></span>
            Remember me
          </label>
          {/* Forgot password removed */}
        </div>

        <button
          type="submit"
          disabled={loading}
          onClick={(e)=>{ e.preventDefault(); if (validate()) onSubmit(e); }}
          className="submit-btn"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="loading-spinner" />
              Signing in…
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Forgot password modal removed */}
      </>
    );
  }

  return (
    <div className="auth-container">
      <div className="aurora-bg"><div className="aurora-inner"></div></div>
      <div className="glass-card">
        <div className="card-content">
          <div className="logo">FinTraQ</div>
          <h2 className="info-title">Welcome Back</h2>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={(e)=>{ e.preventDefault(); if (validate()) onSubmit(e); }} autoComplete="off">
            {/* Email Input */}
            <div className="form-group">
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  autoComplete="off"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                />
              </div>
              {emailError && <div className="auth-error">{emailError}</div>}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {passwordError && <div className="auth-error">{passwordError}</div>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              {/* Forgot password removed */}
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <Loader2 size={18} className="loading-spinner" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          {/* Forgot password modal removed */}

          <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            No account? {onSwitch ? (
              <button type="button" className="forgot-password" onClick={onSwitch}>Create one</button>
            ) : (
              <Link className="forgot-password" to="/register">Create one</Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
