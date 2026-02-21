import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// データベース初期化
let db;

function initDatabase() {
  try {
    // serverディレクトリが存在しない場合は作成
    const serverDir = path.join(__dirname);
    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, { recursive: true });
      console.log('server directory created');
    }

    const dbPath = path.join(__dirname, 'reservations.db');
    console.log('Database path:', dbPath);

    db = new Database(dbPath);

    db.exec(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, time)
      )
    `);

    console.log('Database initialized successfully');

    // テーブル確認
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables:', tables);

  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 予約一覧取得
app.get('/api/reservations', (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const reservations = db.prepare('SELECT * FROM reservations ORDER BY date, time').all();
    res.json(reservations);
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 特定日の予約取得
app.get('/api/reservations/:date', (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const { date } = req.params;
    const reservations = db.prepare(
      'SELECT * FROM reservations WHERE date = ? ORDER BY time'
    ).all(date);
    res.json(reservations);
  } catch (error) {
    console.error('Get day reservations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 特定日の予約数取得
app.get('/api/reservations-count/:date', (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const { date } = req.params;
    const result = db.prepare(
      'SELECT COUNT(*) as count FROM reservations WHERE date = ?'
    ).get(date);
    res.json({ date, count: result.count, max: 5, isFull: result.count >= 5 });
  } catch (error) {
    console.error('Get reservation count error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 予約作成
app.post('/api/reservations', (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }

    const { date, time, customer_id } = req.body;

    if (!date || !time || !customer_id) {
      return res.status(400).json({ error: 'date, time, and customer_id are required' });
    }

    // 同日の予約数確認（上限5件）
    const reservationCount = db.prepare(
      'SELECT COUNT(*) as count FROM reservations WHERE date = ?'
    ).get(date);

    if (reservationCount.count >= 5) {
      return res.status(409).json({ error: 'この日付は予約上限に達しています' });
    }

    console.log('Creating reservation:', { date, time, customer_id });

    const result = db.prepare(
      'INSERT INTO reservations (date, time, customer_id) VALUES (?, ?, ?)'
    ).run(date, time, customer_id);

    const newReservation = db.prepare(
      'SELECT * FROM reservations WHERE id = ?'
    ).get(result.lastInsertRowid);

    console.log('Reservation created:', newReservation);
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Create reservation error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'この時間帯は既に予約されています' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// 予約削除
app.delete('/api/reservations/:id', (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const { id } = req.params;
    db.prepare('DELETE FROM reservations WHERE id = ?').run(id);
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// サーバー起動
initDatabase();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
