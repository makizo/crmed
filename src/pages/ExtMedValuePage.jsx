import React from 'react';
import { useNavigate } from 'react-router-dom';
import { extMedValue } from '../data/extMedValue';

function ExtMedValuePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← トップページに戻る
      </button>

      <h2 className="text-3xl font-bold mb-6 text-purple-600">外用剤 単位量一覧</h2>

      <div className="space-y-4">
        {extMedValue.map((item, index) => (
          <div
            key={index}
            className="border-2 rounded-lg p-5 hover:shadow-md transition border-gray-300"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {item.medName}
              </h3>
              <span className="px-4 py-2 bg-gray-100 rounded-lg text-lg font-medium">
                {item.contentValue}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded">
        <p className="font-medium mb-2">使用上の注意</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>記載されている単位量は標準的な容量です</li>
          <li>製品により容量が異なる場合があります</li>
          <li>処方時は必ず製品情報を確認してください</li>
        </ul>
      </div>
    </div>
  );
}

export default ExtMedValuePage;
