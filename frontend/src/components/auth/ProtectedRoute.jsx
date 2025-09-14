import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../../services/token';
import { useAuth } from '../../context/AuthContext';
import AuthPanel from './AuthPanel';
import { Loader2, Wallet } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { authReady } = useAuth();
  const token = getAccessToken();
  if (!authReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Wallet className="h-10 w-10 text-orange-500 animate-pulse" />
            <h1 className="text-3xl font-bold text-gray-800">FinTraQ</h1>
          </div>
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800">Initializing...</h2>
          <p className="text-gray-600">Setting up your secure session</p>
        </div>
      </div>
    );
  }
  if (!token) return <AuthPanel />;
  return children;
}
