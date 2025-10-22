import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ReservationPage() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [dayReservations, setDayReservations] = useState([]);

  const API_BASE = 'http://localhost:3001/api';

  // 全予約データ取得
  useEffect(() => {
    fetchAllReservations();
  }, []);

  // 選択日の予約取得
  useEffect(() => {
    if (selectedDate) {
      fetchDayReservations(selectedDate);
    }
  }, [selectedDate]);

  const fetchAllReservations = async () => {
    try {
      const response = await fetch(`${API_BASE}/reservations`);
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('予約取得エラー:', error);
    }
  };

  const fetchDayReservations = async (date) => {
    try {
      const response = await fetch(`${API_BASE}/reservations/${date}`);
      const data = await response.json();
      setDayReservations(data);
    } catch (error) {
      console.error('予約取得エラー:', error);
    }
  };

  const createReservation = async (date, time) => {
    try {
      const response = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time })
      });

      if (response.ok) {
        alert(`予約完了: ${date} ${time}`);
        fetchAllReservations();
        fetchDayReservations(date);
      } else {
        const error = await response.json();
        alert(error.error || '予約に失敗しました');
      }
    } catch (error) {
      console.error('予約作成エラー:', error);
      alert('予約に失敗しました');
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
    if (isReserved(time)) {
      alert('この時間帯は既に予約されています');
      return;
    }
    
    if (window.confirm(`${selectedDate} ${time} で予約しますか？`)) {
      createReservation(selectedDate, time);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← トップページに戻る
      </button>

      <h2 className="text-3xl font-bold mb-6 text-blue-600">予約システム</h2>

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
                      {week.map((dayObj, dayIndex) => (
                        <td
                          key={dayIndex}
                          className={`border border-gray-300 p-2 text-center h-12 ${
                            dayObj && (dayObj.isWednesday || dayObj.isSaturday)
                              ? 'cursor-pointer hover:bg-blue-100'
                              : 'bg-gray-50'
                          } ${
                            selectedDate === dayObj?.dateStr ? 'bg-blue-200 font-bold' : ''
                          }`}
                          onClick={() => {
                            if (dayObj && (dayObj.isWednesday || dayObj.isSaturday)) {
                              setSelectedDate(dayObj.dateStr);
                            }
                          }}
                        >
                          {dayObj ? dayObj.day : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* 右側: 時間帯選択 */}
        <div className="w-1/2">
          {selectedDate ? (
            <>
              <h3 className="text-xl font-bold mb-4">
                {selectedDate} の予約時間
              </h3>
              
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {timeSlots.map((time, index) => {
                  const reserved = isReserved(time);
                  
                  return (
                    <div
                      key={index}
                      onClick={() => !reserved && handleTimeSlotClick(time)}
                      className={`border border-gray-300 p-3 rounded text-center ${
                        reserved
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-white hover:bg-green-100 cursor-pointer'
                      }`}
                    >
                      {time} {reserved && '（予約済み）'}
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
          <li>カレンダーの水曜日または土曜日をクリックすると、その日の予約可能時間が表示されます</li>
          <li>予約可能な時間帯をクリックすると予約が完了します</li>
          <li>診療時間: 午前 9:00-12:00 / 午後 14:00-18:00（15分刻み）</li>
        </ul>
      </div>
    </div>
  );
}

export default ReservationPage;
