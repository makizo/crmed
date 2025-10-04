import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CRMed API is running' });
});

// 将来の実装予定:
// - POST /api/calc/bmi
// - POST /api/calc/hba1c
// - GET /api/logs
// - GET /api/pdf/:id

app.listen(PORT, () => {
  console.log(`CRMed API server running on http://localhost:${PORT}`);
});
