import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
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

async function initDatabase() {
  try {
    // serverディレクトリが存在しない場合は作成
    const serverDir = path.join(__dirname);
    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, { recursive: true });
      console.log('server directory created');
    }

    const dbPath = path.join(__dirname, 'reservations.db');
    console.log('Database path:', dbPath);

    db = await open({
      filename: dbPath,
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

    console.log('Database initialized successfully');
    
    // テーブル確認
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
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
app.get('/api/reservations', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const reservations = await db.all('SELECT * FROM reservations ORDER BY date, time');
    res.json(reservations);
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 特定日の予約取得
app.get('/api/reservations/:date', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const { date } = req.params;
    const reservations = await db.all(
      'SELECT * FROM reservations WHERE date = ? ORDER BY time',
      [date]
    );
    res.json(reservations);
  } catch (error) {
    console.error('Get day reservations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 予約作成
app.post('/api/reservations', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    
    const { date, time } = req.body;
    
    if (!date || !time) {
      return res.status(400).json({ error: 'date and time are required' });
    }

    console.log('Creating reservation:', { date, time });

    const result = await db.run(
      'INSERT INTO reservations (date, time) VALUES (?, ?)',
      [date, time]
    );

    const newReservation = await db.get(
      'SELECT * FROM reservations WHERE id = ?',
      [result.lastID]
    );

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
app.delete('/api/reservations/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const { id } = req.params;
    await db.run('DELETE FROM reservations WHERE id = ?', [id]);
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// サーバー起動
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
