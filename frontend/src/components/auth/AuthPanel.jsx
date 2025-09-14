import React, { useState, useRef, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { DollarSign, TrendingUp, PieChart, CreditCard, Wallet, Calculator, Target, BarChart3 } from 'lucide-react';
import './AuthPanel.css';

export default function AuthPanel() {
  const [mode, setMode] = useState('login');
  const cardRef = useRef(null);

  const onSuccess = () => {
    // After successful auth, ProtectedRoute will re-render and show the app
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (clientX - left - width / 2) / (width / 2);
      const y = (clientY - top - height / 2) / (height / 2);

      const rotateX = y * -8; // Max rotation on X-axis
      const rotateY = x * 8;  // Max rotation on Y-axis

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="auth-container">
      <div className="aurora-bg">
        <div className="aurora-inner"></div>
      </div>
      
      {/* Financial Background Elements */}
      <div className="financial-bg-elements">
        <DollarSign className="financial-icon" />
        <TrendingUp className="financial-icon" />
        <PieChart className="financial-icon" />
        <CreditCard className="financial-icon" />
        <Wallet className="financial-icon" />
        <Calculator className="financial-icon" />
        <Target className="financial-icon" />
        <BarChart3 className="financial-icon" />
      </div>

      {/* Geometric Shapes */}
      <div className="geometric-shapes">
        <div className="geometric-shape triangle"></div>
        <div className="geometric-shape hexagon"></div>
        <div className="geometric-shape diamond"></div>
        <div className="geometric-shape circle-outline"></div>
        <div className="geometric-shape square-outline"></div>
      </div>

      {/* Animated Lines */}
      <div className="animated-lines">
        <div className="line horizontal"></div>
        <div className="line horizontal"></div>
        <div className="line vertical"></div>
        <div className="line vertical"></div>
      </div>

      {/* Pulsing Dots */}
      <div className="pulsing-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>

      {/* Floating Orbs */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>

      {/* Wave Patterns */}
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      {/* Spiral Elements */}
      <div className="spiral-container">
        <div className="spiral"></div>
        <div className="spiral"></div>
        <div className="spiral"></div>
      </div>

      {/* Grid Pattern */}
      <div className="grid-pattern"></div>

      {/* Twinkling Stars */}
      <div className="stars-container">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
      </div>

      {/* Nebula Clouds */}
      <div className="nebula-container">
        <div className="nebula"></div>
        <div className="nebula"></div>
        <div className="nebula"></div>
      </div>

      {/* Energy Particles */}
      <div className="energy-particles">
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
      </div>

      {/* Floating Crystals */}
      <div className="crystal-container">
        <div className="crystal"></div>
        <div className="crystal"></div>
        <div className="crystal"></div>
      </div>

      {/* Energy Rings */}
      <div className="energy-rings">
        <div className="energy-ring"></div>
        <div className="energy-ring"></div>
        <div className="energy-ring"></div>
      </div>

      <div className="glass-card" ref={cardRef}>
        <div className="card-content">
          <div className="app-logo">
            <div className="logo-icon">
              <Wallet size={32} />
            </div>
            <div className="logo-text">FinTraQ</div>
          </div>
          <h2 className="info-title">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

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

          <div className="form-wrapper">
            <div className={`auth-form ${mode === 'login' ? 'visible' : ''}`}>
              <Login embedded onSuccess={onSuccess} onSwitch={() => setMode('register')} />
            </div>
            <div className={`auth-form ${mode === 'register' ? 'visible' : ''}`}>
              <Register embedded onSuccess={onSuccess} onSwitch={() => setMode('login')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
