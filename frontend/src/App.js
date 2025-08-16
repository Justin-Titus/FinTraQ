import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import BudgetPlanner from "./components/BudgetPlanner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BudgetPlanner />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;