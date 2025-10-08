import React from 'react';
import { extMedValue } from '../data/extMedValue';

function ExtMedValuePage({ setCurrentPage }) {
  const colors = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#3b82f6'];

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={() => setCurrentPage('home')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← トップページに戻る
      </button>

      <h2 className="text-3xl font-bold mb-6 text-purple-600">外用剤 単位量一覧</h2>

      <div className="space-y-4">
        {extMedValue.map((item, index) => (
          <div
            key={index}
            className="border-2 rounded-lg p-5 hover:shadow-md transition"
            style={{ borderColor: colors[index % colors.length] }}
          >
            <div className="flex justify-between items-center">
              <h3
                className="text-xl font-bold"
                style={{ color: colors[index % colors.length] }}
              >
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
