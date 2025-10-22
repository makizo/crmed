import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BMIPage from './pages/BMIPage';
import HbA1cPage from './pages/HbA1cPage';
import SteroidPage from './pages/SteroidPage';
import ExtMedValuePage from './pages/ExtMedValuePage';
import ExtMedSearchPage from './pages/ExtMedSearchPage';
import DNStagePage from './pages/DNStagePage';
import ReservationPage from './pages/ReservationPage';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br p-8">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bmi" element={<BMIPage />} />
        <Route path="/hba1c" element={<HbA1cPage />} />
        <Route path="/steroid" element={<SteroidPage />} />
        <Route path="/extmedvalue" element={<ExtMedValuePage />} />
        <Route path="/extmedsearch" element={<ExtMedSearchPage />} />  {/* 追加 */}
        <Route path="/dnstage" element={<DNStagePage />} />
        <Route path="/reservation" element={<ReservationPage />} />
      </Routes>
    </div>
  );
}

export default App;
