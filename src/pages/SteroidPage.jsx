import React from 'react';
import { useNavigate } from 'react-router-dom';
import { steroidData } from '../data/steroidData';

function SteroidPage() {
  const navigate = useNavigate();
  const colors = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#3b82f6'];

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← トップページに戻る
      </button>

      <h2 className="text-3xl font-bold mb-6 text-purple-600">外用ステロイド剤 強さ分類表</h2>

      <div className="space-y-4">
        {steroidData.map((category, index) => (
          <div
            key={index}
            className="border-2 rounded-lg p-5 hover:shadow-md transition"
            style={{ borderColor: colors[index] }}
          >
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: colors[index] }}
            >
              {category.rank}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.drugs.map((drug, drugIndex) => (
                <span
                  key={drugIndex}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {drug}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded">
        <p className="font-medium mb-2">使用上の注意</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>顔面や陰部には弱いランクのステロイドを使用</li>
          <li>長期連用は副作用のリスクが高まります</li>
          <li>医師の指示に従って使用してください</li>
        </ul>
      </div>
    </div>
  );
}

export default SteroidPage;
