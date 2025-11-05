import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ReservationPage() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [dayReservations, setDayReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [reservationCounts, setReservationCounts] = useState({});

  const API_BASE = 'http://localhost:3001/api';

  // サーバー接続確認
  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      if (response.ok) {
        setServerStatus('connected');
        console.log('Server connected');
      } else {
        setServerStatus('error');
        console.error('Server health check failed');
      }
    } catch (error) {
      setServerStatus('error');
      console.error('Server connection error:', error);
    }
  };

  // 全予約データ取得
  useEffect(() => {
    if (serverStatus === 'connected') {
      fetchAllReservations();
    }
  }, [serverStatus]);

  // 選択日の予約取得
  useEffect(() => {
    if (selectedDate && serverStatus === 'connected') {
      fetchDayReservations(selectedDate);
    }
  }, [selectedDate, serverStatus]);

  // 月の予約数を一括取得
  useEffect(() => {
    if (serverStatus === 'connected') {
      fetchMonthReservationCounts();
    }
  }, [currentMonth, serverStatus]);

  const fetchAllReservations = async () => {
    try {
      console.log('Fetching all reservations...');
      const response = await fetch(`${API_BASE}/reservations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('All reservations:', data);
      setReservations(data);
    } catch (error) {
      console.error('予約取得エラー:', error);
      alert(`予約データの取得に失敗しました: ${error.message}`);
    }
  };

  const fetchDayReservations = async (date) => {
    try {
      console.log('Fetching reservations for date:', date);
      const response = await fetch(`${API_BASE}/reservations/${date}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Day reservations:', data);
      setDayReservations(data);
    } catch (error) {
      console.error('予約取得エラー:', error);
      alert(`予約データの取得に失敗しました: ${error.message}`);
    }
  };

  const fetchMonthReservationCounts = async () => {
    try {
      const calendars = generateCalendar(currentMonth);
      const counts = {};

      for (const cal of calendars) {
        for (const week of cal.weeks) {
          for (const dayObj of week) {
            if (dayObj && (dayObj.isWednesday || dayObj.isSaturday)) {
              const response = await fetch(`${API_BASE}/reservations-count/${dayObj.dateStr}`);
              if (response.ok) {
                const data = await response.json();
                counts[dayObj.dateStr] = data.count;
              }
            }
          }
        }
      }

      setReservationCounts(counts);
    } catch (error) {
      console.error('予約数取得エラー:', error);
    }
  };

  const createReservation = async (date, time, customerId) => {
    if (!customerId || !customerId.trim()) {
      alert('顧客IDを入力してください');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating reservation:', { date, time, customer_id: customerId });

      const response = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ date, time, customer_id: customerId })
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        alert(`予約完了: ${date} ${time} (顧客ID: ${customerId})`);
        await fetchAllReservations();
        await fetchDayReservations(date);
        await fetchMonthReservationCounts();
      } else {
        alert(`予約に失敗しました: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('予約作成エラー:', error);
      alert(`予約に失敗しました: ${error.message}\n\nサーバーが起動しているか確認してください。`);
    } finally {
      setLoading(false);
    }
  };

  // カレンダー生成（2ヶ月分）
  const generateCalendar = (baseDate) => {
    const calendars = [];
    
    for (let monthOffset = 0; monthOffset < 2; monthOffset++) {
      const targetDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const weeks = [];
      let week = new Array(7).fill(null);
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = (firstDay + day - 1) % 7;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        week[dayOfWeek] = {
          day,
          dateStr,
          isWednesday: dayOfWeek === 3,
          isSaturday: dayOfWeek === 6
        };
        
        if (dayOfWeek === 6 || day === daysInMonth) {
          weeks.push([...week]);
          week = new Array(7).fill(null);
        }
      }
      
      calendars.push({ year, month, weeks });
    }
    
    return calendars;
  };

  const calendars = generateCalendar(currentMonth);

  // 診療時間スロット生成（9:00-12:00, 14:00-18:00）
  const generateTimeSlots = () => {
    const slots = [];
    
    // 午前 9:00-12:00
    for (let hour = 9; hour < 12; hour++) {
      for (let min = 0; min < 60; min += 15) {
        slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
      }
    }
    
    // 午後 14:00-18:00
    for (let hour = 14; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 15) {
        slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const isReserved = (time) => {
    return dayReservations.some(r => r.time === time);
  };

  const handleTimeSlotClick = (time) => {
    if (loading) {
      alert('処理中です。しばらくお待ちください。');
      return;
    }

    const customerId = window.prompt(`${selectedDate} ${time}\n予約する顧客IDを入力してください:`);

    if (customerId === null) {
      // キャンセルされた場合
      return;
    }

    if (!customerId.trim()) {
      alert('顧客IDを入力してください');
      return;
    }

    createReservation(selectedDate, time, customerId.trim());
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← トップページに戻る
      </button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-blue-600">予約システム</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">サーバー状態:</span>
          {serverStatus === 'checking' && (
            <span className="text-yellow-600">確認中...</span>
          )}
          {serverStatus === 'connected' && (
            <span className="text-green-600 font-bold">● 接続中</span>
          )}
          {serverStatus === 'error' && (
            <span className="text-red-600 font-bold">● 未接続</span>
          )}
        </div>
      </div>

      {serverStatus === 'error' && (
        <div className="bg-red-50 border-2 border-red-200 p-4 rounded mb-6">
          <p className="text-red-700 font-bold">サーバーに接続できません</p>
          <p className="text-sm text-red-600 mt-2">
            ターミナルで <code className="bg-red-100 px-2 py-1 rounded">npm run server</code> を実行してサーバーを起動してください。
          </p>
        </div>
      )}

      <div className="flex gap-6">
        {/* 左側: カレンダー */}
        <div className="w-1/2">
          <h3 className="text-xl font-bold mb-4">カレンダー（水・土のみ予約可能）</h3>

          {calendars.map((cal, calIndex) => (
            <div key={calIndex} className="mb-6">
              <h4 className="text-lg font-bold mb-2">
                {cal.year}年 {cal.month + 1}月
              </h4>

              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-red-600">日</th>
                    <th className="border border-gray-300 p-2">月</th>
                    <th className="border border-gray-300 p-2">火</th>
                    <th className="border border-gray-300 p-2">水</th>
                    <th className="border border-gray-300 p-2">木</th>
                    <th className="border border-gray-300 p-2">金</th>
                    <th className="border border-gray-300 p-2 text-blue-600">土</th>
                  </tr>
                </thead>
                <tbody>
                  {cal.weeks.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                      {week.map((dayObj, dayIndex) => {
                        const reservationCount = dayObj ? (reservationCounts[dayObj.dateStr] || 0) : 0;
                        const isFull = reservationCount >= 5;
                        const isReservableDay = dayObj && (dayObj.isWednesday || dayObj.isSaturday);

                        let cellBgColor = 'bg-gray-50';
                        if (isReservableDay) {
                          cellBgColor = isFull ? 'bg-red-200' : 'bg-green-200';
                        }

                        return (
                          <td
                            key={dayIndex}
                            className={`border border-gray-300 p-2 text-center h-12 align-top ${cellBgColor} ${
                              isReservableDay ? 'cursor-pointer hover:opacity-80' : ''
                            } ${selectedDate === dayObj?.dateStr ? 'ring-2 ring-blue-500 font-bold' : ''}`}
                            onClick={() => {
                              if (isReservableDay) {
                                setSelectedDate(dayObj.dateStr);
                              }
                            }}
                          >
                            <div>{dayObj ? dayObj.day : ''}</div>
                            {isReservableDay && (
                              <div className="text-xs text-gray-700">{reservationCount}/5</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* 右側: 予約状況 */}
        <div className="w-1/2">
          {selectedDate ? (
            <>
              <h3 className="text-xl font-bold mb-4">
                {selectedDate} の予約状況 ({dayReservations.length}/5)
              </h3>

              {loading && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4 text-center">
                  処理中...
                </div>
              )}

              {/* 時間スロット一覧と予約ID */}
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {timeSlots.map((time, index) => {
                  // この時間の予約を取得
                  const reservationsForTime = dayReservations.filter(r => r.time === time);
                  const customerIds = reservationsForTime.map(r => r.customer_id).join(', ');

                  return (
                    <div
                      key={index}
                      onClick={() => !loading && handleTimeSlotClick(time)}
                      className={`border border-gray-300 p-3 rounded flex justify-between items-center ${
                        loading
                          ? 'bg-gray-100 cursor-wait'
                          : 'bg-white hover:bg-green-100 cursor-pointer'
                      }`}
                    >
                      <span className="font-medium">{time}</span>
                      <span className="text-blue-600 text-sm">
                        {customerIds || ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              カレンダーから水曜日または土曜日を選択してください
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded">
        <p className="font-medium mb-2">使い方</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>カレンダーの水曜日または土曜日（色付き）をクリックすると、その日の予約情報が表示されます</li>
          <li>緑色の日付: 予約に空きあり（空き/5）</li>
          <li>赤色の日付: 予約が満杯</li>
          <li>時間帯をクリックすると、顧客IDを入力するダイアログが表示されます</li>
          <li>診療時間: 午前 9:00-12:00 / 午後 14:00-18:00（15分刻み）</li>
          <li>各日の予約上限: 5枠</li>
        </ul>
      </div>

      {/* デバッグ情報（開発時のみ表示） */}
      <div className="mt-6 text-xs text-gray-500 bg-gray-100 p-3 rounded">
        <p className="font-bold mb-1">デバッグ情報:</p>
        <p>選択日: {selectedDate || '未選択'}</p>
        <p>全予約数: {reservations.length}件</p>
        <p>本日の予約数: {dayReservations.length}件</p>
        <p className="mt-2 text-xs">
          ※ブラウザの開発者ツール（F12）のConsoleタブで詳細なログを確認できます
        </p>
      </div>
    </div>
  );
}

export default ReservationPage;
