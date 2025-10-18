import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { extMedValue } from '../data/extMedValue';

function ExtMedSearchPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState(extMedValue);

  // インクリメンタルサーチ（medNameとyomiの両方を検索対象）
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredResults(extMedValue);
    } else {
      const filtered = extMedValue.filter(item => {
        const searchLower = searchText.toLowerCase();
        const medNameMatch = item.medName.toLowerCase().includes(searchLower);
        const yomiMatch = item.yomi.toLowerCase().includes(searchLower);
        return medNameMatch || yomiMatch;
      });
      setFilteredResults(filtered);
    }
  }, [searchText]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← トップページに戻る
      </button>

      <h2 className="text-3xl font-bold mb-6 text-purple-600">外用剤検索</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">検索（薬剤名・読み）</label>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="薬剤名または読みを入力してください"
          autoFocus
        />
      </div>

      <div className="mb-4 text-sm text-gray-600">
        検索結果: {filteredResults.length}件
      </div>

      <div className="space-y-3">
        {filteredResults.length > 0 ? (
          filteredResults.map((item, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition hover:border-purple-300"
            >
              <p className="text-lg">
                <span className="font-bold">{item.medName}</span>：{item.contentValue}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            該当する薬剤が見つかりませんでした
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded">
        <p className="font-medium mb-2">使い方</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>検索ボックスに薬剤名または読みの一部を入力すると、リアルタイムで絞り込まれます</li>
          <li>大文字・小文字、ひらがな・カタカナは区別されません</li>
          <li>空欄にすると全件表示されます</li>
        </ul>
      </div>
    </div>
  );
}

export default ExtMedSearchPage;
