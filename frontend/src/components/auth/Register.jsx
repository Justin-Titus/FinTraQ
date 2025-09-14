import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Register({ onSwitch, onSuccess, embedded = false }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const validate = () => {
    let ok = true;
    setNameError(''); setEmailError(''); setPasswordError(''); setConfirmError('');
    const n = name.trim(); const e = email.trim(); const p = password;
    if (n.length < 2) { setNameError('Name must be at least 2 characters'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setEmailError('Enter a valid email'); ok = false; }
    if (p.length < 8 || !/[A-Za-z]/.test(p) || !/\d/.test(p)) { setPasswordError('Min 8 chars, include letters and numbers'); ok = false; }
    if (confirm !== p) { setConfirmError('Passwords do not match'); ok = false; }
    return ok;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register({ name: name.trim(), email: email.trim(), password });
    setLoading(false);
    if (res.ok) {
      if (onSuccess) onSuccess();
    }
    else setError(res.error || 'Registration failed');
  };


  if (embedded) {
    return (
      <>
        {error && <div className="auth-error">{error}</div>}

        {/* Name */}
        <div className="form-group">
          <div className="input-wrapper">
            <User className="input-icon" size={20} />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
            />
          </div>
          {nameError && <div className="auth-error">{nameError}</div>}
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="form-group">
          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
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

        {/* Confirm Password */}
        <div className="form-group">
          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e)=>setConfirm(e.target.value)}
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {confirmError && <div className="auth-error">{confirmError}</div>}
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
              Creating…
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </>
    );
  }

  return (
    <div className="auth-container">
      <div className="aurora-bg"><div className="aurora-inner"></div></div>
      <div className="glass-card">
        <div className="card-content">
          <div className="logo">FinTraQ</div>
          <h2 className="info-title">Create Account</h2>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={(e)=>{ e.preventDefault(); if (validate()) onSubmit(e); }} autoComplete="off">
            {/* Name */}
            <div className="form-group">
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  required
                />
              </div>
              {nameError && <div className="auth-error">{nameError}</div>}
            </div>

            {/* Email */}
            <div className="form-group">
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                />
              </div>
              {emailError && <div className="auth-error">{emailError}</div>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
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

            {/* Confirm Password */}
            <div className="form-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirm}
                  onChange={(e)=>setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {confirmError && <div className="auth-error">{confirmError}</div>}
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <Loader2 size={18} className="loading-spinner" />
                  Creating…
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Have an account? {onSwitch ? (
              <button type="button" className="forgot-password" onClick={onSwitch}>Sign in</button>
            ) : (
              <Link className="forgot-password" to="/login">Sign in</Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
