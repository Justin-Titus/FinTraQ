import React, { useState, useRef, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { Wallet, PieChart, TrendingUp, Lock, X } from 'lucide-react';
import './AuthPanel.css';

export default function AuthPanel({ initialMode = 'login', onClose, isModal = false }) {
  const [mode, setMode] = useState(initialMode);
  const cardRef = useRef(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const onSuccess = () => {
    if (onClose) onClose();
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card || isModal) return;

    const handleMouseMove = (e) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (clientX - left - width / 2) / (width / 2);
      const y = (clientY - top - height / 2) / (height / 2);

      const rotateX = y * -4;
      const rotateY = x * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isModal]);

  const content = (
    <div className={`auth-glass-card ${isModal ? 'in-modal' : ''}`} ref={cardRef}>
      
      {/* Integrated Modal Close Button */}
      {onClose && (
        <button className="auth-card-close-btn" onClick={onClose} title="Close">
          <X size={18} />
        </button>
      )}

      <div className="auth-card-content">
        
        {/* Brand Header */}
        <div className="app-logo">
          <div className="logo-icon">
            <Wallet size={26} />
          </div>
          <div className="logo-text">FinTraQ</div>
        </div>

        <h2 className="info-title">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="info-subtitle">
          {mode === 'login' 
            ? 'Sign in to manage your budget & expenses' 
            : 'Start tracking your financial goals today'}
        </p>

        {/* Segmented Switcher */}
        <div className="form-toggle">
          <button
            type="button"
            className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`toggle-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Sign Up
          </button>
        </div>

        {/* Embedded Forms */}
        <div className="form-wrapper">
          <div className={`auth-form ${mode === 'login' ? 'visible' : ''}`}>
            <Login embedded onSuccess={onSuccess} onSwitch={() => setMode('register')} />
          </div>
          <div className={`auth-form ${mode === 'register' ? 'visible' : ''}`}>
            <Register embedded onSuccess={onSuccess} onSwitch={() => setMode('login')} />
          </div>
        </div>

        {/* Feature Badges */}
        <div className="auth-features">
          <div className="feature-item">
            <Lock size={14} />
            <span>JWT Authenticated</span>
          </div>
          <div className="feature-item">
            <PieChart size={14} />
            <span>Visual Analytics</span>
          </div>
          <div className="feature-item">
            <TrendingUp size={14} />
            <span>Real-time Budgeting</span>
          </div>
        </div>

      </div>
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <div className="auth-container">
      {/* Background Orbs for Standalone View */}
      <div className="auth-bg-orbs">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>
      {content}
    </div>
  );
}
