import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import FinTraQ from "./components/FinTraQ";
import { AuthProvider } from "./context/AuthContext";
// Auth pages are rendered in-place by ProtectedRoute to keep a single URL
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <FinTraQ />
                </ProtectedRoute>
              }
            />
            {/** Removed explicit login/register routes to keep one URL */}
            {/** Removed /dashboard route to keep SPA focused on FinTraQ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;