import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import BMIPage from './pages/BMIPage';
import HbA1cPage from './pages/HbA1cPage';
import SteroidPage from './pages/SteroidPage';
import ExtMedValuePage from './pages/ExtMedValuePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [bmiData, setBmiData] = useState({ height: '', weight: '', result: null });
  const [hba1cData, setHba1cData] = useState({ hba1c: '', result: null });

  const calculateBMI = () => {
    const h = parseFloat(bmiData.height) / 100;
    const w = parseFloat(bmiData.weight);
    if (h > 0 && w > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      let category = '';
      if (bmi < 18.5) category = '低体重';
      else if (bmi < 25) category = '普通体重';
      else if (bmi < 30) category = '肥満(1度)';
      else if (bmi < 35) category = '肥満(2度)';
      else if (bmi < 40) category = '肥満(3度)';
      else category = '肥満(4度)';
      setBmiData({ ...bmiData, result: { bmi, category } });
    }
  };

  const calculateAvgGlucose = () => {
    const hba1c = parseFloat(hba1cData.hba1c);
    if (hba1c > 0) {
      const avgGlucose = (28.7 * hba1c - 46.7).toFixed(0);
      setHba1cData({ ...hba1cData, result: avgGlucose });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-8">
      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'bmi' && (
        <BMIPage
          setCurrentPage={setCurrentPage}
          bmiData={bmiData}
          setBmiData={setBmiData}
          calculateBMI={calculateBMI}
        />
      )}
      {currentPage === 'hba1c' && (
        <HbA1cPage
          setCurrentPage={setCurrentPage}
          hba1cData={hba1cData}
          setHba1cData={setHba1cData}
          calculateAvgGlucose={calculateAvgGlucose}
        />
      )}
      {currentPage === 'steroid' && <SteroidPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'extmedvalue' && <ExtMedValuePage setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;
