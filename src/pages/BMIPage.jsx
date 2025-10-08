import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BMIPage() {
  const navigate = useNavigate();
  
  // 入力状態
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('1.2');
  
  // 結果状態
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleReset = () => {
    setAge('');
    setGender('male');
    setHeight('');
    setWeight('');
    setActivity('1.2');
    setResult(null);
    setError('');
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age, 10);
    const activityNum = parseFloat(activity);

    // バリデーション
    if (isNaN(heightNum) || heightNum < 1) {
      setError('身長を正しく入力してください（1以上の数値）');
      setResult(null);
      return;
    }
    if (isNaN(weightNum) || weightNum < 1) {
      setError('体重を正しく入力してください（1以上の数値）');
      setResult(null);
      return;
    }
    if (isNaN(ageNum) || ageNum < 1) {
      setError('年齢を正しく入力してください（1以上の整数）');
      setResult(null);
      return;
    }

    // BMI計算
    const heightM = heightNum / 100;
    const curBMI = weightNum / (heightM * heightM);
    const bestbw = 22 * heightM * heightM;
    const bestbwDiff = bestbw - weightNum;
    const minWeight = 18.5 * heightM * heightM;
    const minWeightDiff = minWeight - weightNum;
    const maxWeight = 25 * heightM * heightM;
    const maxWeightDiff = maxWeight - weightNum;

    // BMI判定
    let category = '';
    if (curBMI < 18.5) category = '低体重';
    else if (curBMI < 25) category = '普通体重';
    else if (curBMI < 30) category = '肥満(1度)';
    else if (curBMI < 35) category = '肥満(2度)';
    else if (curBMI < 40) category = '肥満(3度)';
    else category = '肥満(4度)';

    // ハリスベネディクト式
    let bmrHarris;
    if (gender === 'male') {
      bmrHarris = 66.47 + (13.75 * weightNum) + (5.003 * heightNum) - (6.755 * ageNum);
    } else {
      bmrHarris = 655.1 + (9.563 * weightNum) + (1.850 * heightNum) - (4.676 * ageNum);
    }

    // Mifflin-St Jeor式
    let bmrMifflin;
    if (gender === 'male') {
      bmrMifflin = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else {
      bmrMifflin = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
    }

    const tdeeHarris = bmrHarris * activityNum;
    const tdeeMifflin = bmrMifflin * activityNum;
    const bmrMean = (bmrHarris + bmrMifflin) / 2;
    const tdeeMean = (tdeeHarris + tdeeMifflin) / 2;

    setResult({
      curBMI: curBMI.toFixed(2),
      category,
      bestbw: bestbw.toFixed(1),
      bestbwDiff: bestbwDiff.toFixed(1),
      minWeight: minWeight.toFixed(1),
      minWeightDiff: minWeightDiff.toFixed(1),
      maxWeight: maxWeight.toFixed(1),
      maxWeightDiff: maxWeightDiff.toFixed(1),
      bmrHarris: bmrHarris.toFixed(0),
      tdeeHarris: tdeeHarris.toFixed(0),
      bmrMifflin: bmrMifflin.toFixed(0),
      tdeeMifflin: tdeeMifflin.toFixed(0),
      bmrMean: bmrMean.toFixed(0),
      tdeeMean: tdeeMean.toFixed(0),
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← トップページに戻る
      </button>

      <h2 className="text-3xl font-bold mb-6 text-blue-600">BMI・基礎代謝計算ツール</h2>

      <div className="mb-6">
        <button
          type="button"
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          初期化
        </button>
      </div>

      <form onSubmit={handleCalculate} className="space-y-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium w-24">年齢:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
            placeholder="30"
            required
            min="1"
          />
          <div className="flex items-center gap-4 ml-8">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
              />
              男性
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
              />
              女性
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium w-24">身長 (cm):</label>
          <input
            type="number"
            step="0.1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
            placeholder="170"
            required
            min="1"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium w-24">体重 (kg):</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
            placeholder="65"
            required
            min="1"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium w-24">活動レベル:</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-80"
            required
          >
            <option value="1.2">ほとんど運動しない（1.2）</option>
            <option value="1.375">軽い運動（週1-3日）（1.375）</option>
            <option value="1.55">中程度の運動（週3-5日）（1.55）</option>
            <option value="1.725">激しい運動（週6-7日）（1.725）</option>
            <option value="1.9">非常に激しい運動（1.9）</option>
          </select>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-medium"
        >
          計算する
        </button>
      </form>

      {result && (
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <h3 className="text-xl font-bold mb-4">【計算結果】</h3>
          
          <div className="space-y-2 mb-4">
            <p><strong>現在のBMI：</strong>{result.curBMI} （{result.category}）</p>
            <p><strong>ベスト体重：</strong>{result.bestbw} kg</p>
            <p><strong>必要増減量：</strong>{result.bestbwDiff} kg</p>
            <p>
              <strong>適正体重範囲：</strong>
              {result.minWeight} ({result.minWeightDiff}) kg ～ {result.maxWeight} ({result.maxWeightDiff}) kg
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-green-100">
                  <th className="border border-gray-300 p-2">方式</th>
                  <th className="border border-gray-300 p-2">基礎代謝量 (kcal/日)</th>
                  <th className="border border-gray-300 p-2">推定消費カロリー (kcal/日)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">ハリスベネディクト式</td>
                  <td className="border border-gray-300 p-2 text-center">{result.bmrHarris}</td>
                  <td className="border border-gray-300 p-2 text-center">{result.tdeeHarris}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 text-center">Mifflin-St Jeor式</td>
                  <td className="border border-gray-300 p-2 text-center">{result.bmrMifflin}</td>
                  <td className="border border-gray-300 p-2 text-center">{result.tdeeMifflin}</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-gray-300 p-2 text-center font-bold">上記2つの平均</td>
                  <td className="border border-gray-300 p-2 text-center font-bold">{result.bmrMean}</td>
                  <td className="border border-gray-300 p-2 text-center font-bold">{result.tdeeMean}</td>
                </tr>
              </tbody>
            </table>
          </div>
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
        <p className="mt-3 font-medium">基礎代謝量について</p>
        <p className="text-xs">基礎代謝量は安静時に消費されるカロリーです。推定消費カロリーは活動レベルを考慮した1日の総消費カロリーの目安です。</p>
      </div>
    </div>
  );
}

export default BMIPage;
