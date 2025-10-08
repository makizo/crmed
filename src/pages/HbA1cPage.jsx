import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HbA1cPage() {
  const navigate = useNavigate();
  const [hba1cData, setHba1cData] = useState({ hba1c: '', result: null });

  const calculateAvgGlucose = () => {
    const hba1c = parseFloat(hba1cData.hba1c);
    if (hba1c > 0) {
      const avgGlucose = (28.7 * hba1c - 46.7).toFixed(0);
      setHba1cData({ ...hba1cData, result: avgGlucose });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← トップページに戻る
      </button>

      <h2 className="text-3xl font-bold mb-6 text-green-600">HbA1c → 平均血糖値換算</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">HbA1c (%)</label>
          <input
            type="number"
            step="0.1"
            value={hba1cData.hba1c}
            onChange={(e) => setHba1cData({ ...hba1cData, hba1c: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="7.0"
          />
        </div>

        <button
          onClick={calculateAvgGlucose}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
        >
          計算する
        </button>
      </div>

      {hba1cData.result && (
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <h3 className="text-xl font-bold mb-2">計算結果</h3>
          <p className="text-3xl font-bold text-green-600">推定平均血糖値: {hba1cData.result} mg/dL</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded">
        <p className="font-medium mb-2">計算式（Nathan式）</p>
        <p className="font-mono bg-white p-2 rounded">平均血糖値 (mg/dL) = 28.7 × HbA1c (%) - 46.7</p>
        <p className="mt-2 text-xs">※この式は推定値であり、個人差があります</p>
      </div>
    </div>
  );
}

export default HbA1cPage;
