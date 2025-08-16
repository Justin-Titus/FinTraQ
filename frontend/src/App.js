import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import FinTraQ from "./components/FinTraQ";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FinTraQ />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;