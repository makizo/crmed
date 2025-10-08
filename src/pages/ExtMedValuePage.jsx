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
    </div>
  );
}

export default ExtMedValuePage;
