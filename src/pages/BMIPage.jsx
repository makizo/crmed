import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BMIPage() {
  const navigate = useNavigate();
  const [bmiData, setBmiData] = useState({ height: '', weight: '', result: null });

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

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← トップページに戻る
      </button>

      <h2 className="text-3xl font-bold mb-6 text-blue-600">BMI計算</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">身長 (cm)</label>
          <input
            type="number"
            value={bmiData.height}
            onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="170"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">体重 (kg)</label>
          <input
            type="number"
            value={bmiData.weight}
            onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="65"
          />
        </div>

        <button
          onClick={calculateBMI}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          計算する
        </button>
      </div>

      {bmiData.result && (
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <h3 className="text-xl font-bold mb-2">計算結果</h3>
          <p className="text-3xl font-bold text-blue-600 mb-2">BMI: {bmiData.result.bmi}</p>
          <p className="text-lg">判定: <span className="font-bold">{bmiData.result.category}</span></p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded">
        <p className="font-medium mb-2">BMI判定基準（日本肥満学会）</p>
        <ul className="space-y-1">
          <li>18.5未満: 低体重</li>
          <li>18.5〜25未満: 普通体重</li>
          <li>25〜30未満: 肥満(1度)</li>
          <li>30〜35未満: 肥満(2度)</li>
          <li>35〜40未満: 肥満(3度)</li>
          <li>40以上: 肥満(4度)</li>
        </ul>
      </div>
    </div>
  );
}

export default BMIPage;
