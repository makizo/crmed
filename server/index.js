import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// データベース初期化
let db;

async function initDatabase() {
  db = await open({
    filename: path.join(__dirname, 'reservations.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, time)
    )
  `);

  console.log('Database initialized');
}

// 予約一覧取得
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await db.all('SELECT * FROM reservations ORDER BY date, time');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 特定日の予約取得
app.get('/api/reservations/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const reservations = await db.all(
      'SELECT * FROM reservations WHERE date = ? ORDER BY time',
      [date]
    );
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 予約作成
app.post('/api/reservations', async (req, res) => {
  try {
    const { date, time } = req.body;
    
    if (!date || !time) {
      return res.status(400).json({ error: 'date and time are required' });
    }

    const result = await db.run(
      'INSERT INTO reservations (date, time) VALUES (?, ?)',
      [date, time]
    );

    const newReservation = await db.get(
      'SELECT * FROM reservations WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json(newReservation);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'この時間帯は既に予約されています' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// 予約削除
app.delete('/api/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM reservations WHERE id = ?', [id]);
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// サーバー起動
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
