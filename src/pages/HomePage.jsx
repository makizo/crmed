import React from 'react';

function HomePage({ setCurrentPage }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">医療計算・資料アプリ</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setCurrentPage('bmi')}
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-blue-100 hover:border-blue-300"
        >
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-bold mb-2">BMI計算</h2>
          <p className="text-gray-600">身長・体重からBMIと肥満度を計算します</p>
        </div>

        <div
          onClick={() => setCurrentPage('hba1c')}
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-green-100 hover:border-green-300"
        >
          <div className="text-4xl mb-4">🩸</div>
          <h2 className="text-xl font-bold mb-2">HbA1c換算</h2>
          <p className="text-gray-600">HbA1cから平均血糖値を計算します</p>
        </div>

        <div
          onClick={() => setCurrentPage('steroid')}
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-purple-100 hover:border-purple-300"
        >
          <div className="text-4xl mb-4">💊</div>
          <h2 className="text-xl font-bold mb-2">ステロイド一覧</h2>
          <p className="text-gray-600">外用ステロイド剤の強さ分類表</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
