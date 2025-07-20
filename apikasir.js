import express from 'express';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());

// Koneksi MongoDB
const client = new MongoClient('mongodb://mongoadmin:secret@mongodb:27017');
let db;

// Secret Key JWT (simpan di env di production!)
const JWT_SECRET = 'rahasia-kasir-123';

// Middleware Auth
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Cek user di MongoDB
  const user = await db.collection('users').findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Username/password salah' });
  }

  // Generate Token
  const token = jwt.sign(
    { userId: user._id, role: user.role }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// Get Produk (Protected)
app.get('/api/products', authenticateToken, (req, res) => {
  const products = [
    {
      "id": 1,
      "name": "Ayam Kentucky",
      "price": 6000,
      "image": "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec",
      // ... (data produk lengkap seperti yang Anda berikan)
    }
    // ... (produk lainnya)
  ];
  res.json(products);
});

// Jalankan Server
async function start() {
  await client.connect();
  db = client.db('kasir_db');
  app.listen(3000, () => console.log('API running on port 3000'));
}
start();