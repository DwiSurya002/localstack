import express from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import morgan from 'morgan';
import cors from 'cors';

// Load .env configuration
dotenv.config();

// Inisialisasi aplikasi Express
const app = express();
const port = Number(process.env.PORT) || 3000;

// Middleware global
app.use(express.json()); // parsing body JSON
app.use(cors());         // mengizinkan cross-origin
app.use(morgan('dev'));  // logging request ke console

// Struktur data untuk Todo
type Todo = {
  id: string;
  todo_name: string;
  todo_description: string;
  todo_completed: boolean;
};

// Penyimpanan data sementara
const todos: Todo[] = [];

/**
 * GET /healthcheck
 * Mengecek apakah server hidup
 */
app.get('/healthcheck', (_req, res) => {
  return res.status(200).send('OK');
});

/**
 * GET /
 * Endpoint root menampilkan info server dan daftar todos
 */
app.get('/', (_req, res) => {
  return res.status(200).json({
    message: '✅ Server is running. Use POST /todos to add todos.',
    todos,
  });
});

/**
 * GET /todos
 * Menampilkan semua data todos
 */
app.get('/todos', (_req, res) => {
  return res.status(200).json({ todos });
});

/**
 * POST /todos
 * Menambahkan todo baru
 */
app.post('/todos', (req, res) => {
  const { todo } = req.body;

  // Validasi isi body request
  if (
    !todo ||
    typeof todo.todo_name !== 'string' ||
    typeof todo.todo_description !== 'string' ||
    typeof todo.todo_completed !== 'boolean'
  ) {
    return res.status(400).json({
      error: '❌ Invalid todo format. Required fields: todo_name (string), todo_description (string), todo_completed (boolean)',
    });
  }

  // Buat objek todo dengan UUID
  const newTodo: Todo = {
    id: uuidv4(),
    ...todo,
  };

  todos.push(newTodo);

  // Kembalikan hasil ke client
  return res.status(201).json({
    message: '✅ Todo berhasil ditambahkan.',
    todo: newTodo,
  });
});

/**
 * Fallback jika endpoint tidak ditemukan
 */
app.use((_req, res) => {
  return res.status(404).json({ error: 'Not Found' });
});

// Menyalakan server
app.listen(port, () => {
  console.log(`✅ Server is listening on http://localhost:${port}`);
});
