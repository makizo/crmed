import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DNStagePage() {
  const navigate = useNavigate();
  
  // 入力状態
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('male');
  const [scr, setScr] = useState('');
  const [albInputMode, setAlbInputMode] = useState('value');
  const [uacr, setUacr] = useState('');
  const [albCategory, setAlbCategory] = useState('A1');
  const [result, setResult] = useState(null);

  function calcEgfr(ageNum, sexVal, scrVal) {
    const k = sexVal === 'female' ? 0.7 : 0.9;
    const a = sexVal === 'female' ? -0.329 : -0.411;
    const minPart = Math.min(scrVal / k, 1) ** a;
    const maxPart = Math.max(scrVal / k, 1) ** -1.209;
    const sexFactor = sexVal === 'female' ? 1.018 : 1.0;
    const egfr = 141 * minPart * maxPart * Math.pow(0.993, ageNum) * sexFactor;
    return egfr;
  }

  function gfrCategory(egfr) {
    if (egfr >= 90) return 'G1';
    if (egfr >= 60) return 'G2';
    if (egfr >= 45) return 'G3a';
    if (egfr >= 30) return 'G3b';
    if (egfr >= 15) return 'G4';
    return 'G5';
  }

  function albuminCategoryFromUacr(uacrVal) {
    if (uacrVal < 30) return 'A1';
    if (uacrVal < 300) return 'A2';
    return 'A3';
  }

  const riskMatrix = {
    G1: { A1: '低リスク', A2: '中等度リスク', A3: '高リスク' },
    G2: { A1: '低リスク', A2: '中等度リスク', A3: '高リスク' },
    G3a:{ A1: '中等度リスク', A2: '高リスク',   A3: '非常に高リスク' },
    G3b:{ A1: '高リスク',   A2: '非常に高リスク', A3: '非常に高リスク' },
    G4: { A1: '非常に高リスク', A2: '非常に高リスク', A3: '非常に高リスク' },
    G5: { A1: '非常に高リスク', A2: '非常に高リスク', A3: '非常に高リスク' },
  };

  const handleCalculate = () => {
    const ageNum = Number(age);
    const scrNum = Number(scr);

    if (!ageNum || ageNum <= 0 || !scrNum || scrNum <= 0) {
      setResult({ error: '年齢と血清Cr（mg/dL）を正しく入力してください。' });
      return;
    }

    let aCat = albCategory;
    if (albInputMode === 'value') {
      const uacrNum = Number(uacr);
      if (!uacrNum && uacrNum !== 0) {
        setResult({ error: '尿アルブミン（UACR mg/gCr）を正しく入力してください。' });
        return;
      }
      aCat = albuminCategoryFromUacr(uacrNum);
    }

    const egfr = calcEgfr(ageNum, sex, scrNum);
    const gCat = gfrCategory(egfr);
    const risk = riskMatrix[gCat][aCat];
    setResult({
      egfr: egfr.toFixed(1),
      gCat,
      aCat,
      risk,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← トップページに戻る
      </button>

      <h2 className="text-3xl font-bold mb-6 text-blue-600">糖尿病性腎症ステージ判定</h2>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">年齢（歳）</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="65"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">性別</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="male">男性</option>
              <option value="female">女性</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">血清クレアチニン（mg/dL）</label>
            <input
              type="number"
              step="0.01"
              value={scr}
              onChange={(e) => setScr(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1.02"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">尿アルブミン入力形式</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAlbInputMode('value')}
                className={`px-4 py-2 rounded ${albInputMode === 'value' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                値で入力（UACR mg/gCr）
              </button>
              <button
                type="button"
                onClick={() => setAlbInputMode('category')}
                className={`px-4 py-2 rounded ${albInputMode === 'category' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                区分で選択（A1/A2/A3）
              </button>
            </div>
          </div>

          {albInputMode === 'value' ? (
            <div>
              <label className="block text-sm font-medium mb-2">UACR（mg/gCr）</label>
              <input
                type="number"
                step="1"
                value={uacr}
                onChange={(e) => setUacr(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="120"
              />
              <p className="text-xs text-gray-600 mt-2">区分目安: A1 &lt; 30, A2 30〜299, A3 ≥ 300</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">アルブミン尿区分</label>
              <select
                value={albCategory}
                onChange={(e) => setAlbCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="A1">A1（正常〜軽度）</option>
                <option value="A2">A2（微量）</option>
                <option value="A3">A3（顕性）</option>
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          判定する
        </button>
      </div>

      {result && !result.error && (
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <h3 className="text-xl font-bold mb-2">判定結果</h3>
          <p className="text-lg">eGFR: <span className="font-bold">{result.egfr}</span> mL/min/1.73m²</p>
          <p className="text-lg">G区分: <span className="font-bold">{result.gCat}</span></p>
          <p className="text-lg">A区分: <span className="font-bold">{result.aCat}</span></p>
          <p className="text-lg">リスク: <span className="font-bold">{result.risk}</span></p>
          <p className="text-xs text-gray-600 mt-2">
            参考: CKD-EPI 2009式（日本人補正なし）。正式な診療判断には各学会の指針をご確認ください。
          </p>
        </div>
      )}

      {result && result.error && (
        <div className="bg-red-50 p-4 rounded border-2 border-red-200 text-red-700">
          {result.error}
        </div>
      )}
    </div>
  );
}

export default DNStagePage;
