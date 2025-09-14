import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProtectedDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded" onClick={logout}>Logout</button>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">Welcome {user?.name || user?.email}</p>
          <div className="mt-4">
            <Link className="text-blue-600 hover:underline" to="/">Open FinTraQ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
