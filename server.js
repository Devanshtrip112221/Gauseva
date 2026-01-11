const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public', 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'ruchi2210',
  database: process.env.DB_NAME || 'gau_seva_db',
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL'); 
  }
});


app.post('/api/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, email, phone || '', hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.json({ success: false, error: 'Email already registered' });
        }
        console.error('Registration error:', err);
        return res.json({ success: false, error: 'Database error' });
      }
      res.json({ success: true, id: result.insertId });
    });
  } catch (error) {
    console.error('Hashing error:', error);
    res.json({ success: false, error: 'Server error' });
  }
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, error: 'Missing email or password' });
  }

  const sql = `SELECT * FROM users WHERE email=?`;
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Login DB error:', err);
      return res.json({ success: false, error: 'Database error' });
    }
    if (results.length === 0) {
      return res.json({ success: false, error: 'Invalid email or password' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.json({ success: false, error: 'Invalid email or password' });
    }

    res.json({ success: true, user });
  });
});


app.post('/api/getUser', (req, res) => {
  const { email } = req.body;
  const sql = `SELECT * FROM users WHERE email=?`;
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('GetUser DB error:', err);
      return res.json({ success: false, error: 'Database error' });
    }
    if (results.length === 0) {
      return res.json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: results[0] });
  });
});


app.post('/submit-gau-seva', upload.single('photo'), (req, res) => {
  const { name, message, latitude, longitude } = req.body;
  const photoPath = req.file ? '/uploads/' + req.file.filename : null;

  const sql = `INSERT INTO gau_seva (name, message, photo, latitude, longitude) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, message, photoPath, latitude, longitude], (err, result) => {
    if (err) {
      console.error('Gau Seva DB error:', err);
      return res.status(500).send('Database error');
    }
    res.send('Message saved');
  });
});


app.get('/gau-seva-messages', (req, res) => {
  const sql = `SELECT * FROM gau_seva ORDER BY timestamp DESC`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fetch Gau Seva error:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${3000}`);
});


app.get('/gau-seva-messages', (req, res) => {
  console.log("Sending messages:", allMessages); 
  res.json(allMessages);
});