import express from 'express'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env') })

const app = express()
app.use(express.json())

// Create MariaDB / MySQL Connection Pool using .env credentials
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'sanat_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Test connection on startup
;(async () => {
  try {
    const conn = await pool.getConnection()
    console.log(`✅ Connected to MariaDB database: ${process.env.DB_DATABASE || 'sanat_db'}`)
    conn.release()
  } catch (err) {
    console.error(`⚠️ MariaDB connection warning: ${err.message}`)
    console.log(`Please verify your MariaDB server is running and .env credentials are correct.`)
  }
})()

// ─── Health ───
app.get('/api/health', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as ok')
    res.json({ ok: true, db: rows[0].ok === 1 })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// ─── Settings ───
app.get('/api/settings', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT key_name, value FROM settings')
    const settings = {}
    for (const row of rows) {
      settings[row.key_name] = row.value
    }
    res.json(settings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/settings', async (req, res) => {
  try {
    for (const [key, val] of Object.entries(req.body)) {
      await pool.query(
        'INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)',
        [key, String(val)]
      )
    }
    const [rows] = await pool.query('SELECT key_name, value FROM settings')
    const settings = {}
    for (const row of rows) {
      settings[row.key_name] = row.value
    }
    res.json(settings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Artworks CRUD ───
app.get('/api/artworks', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM artworks ORDER BY id DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/artworks', async (req, res) => {
  try {
    const { title, artist, price, size, canvas, technique, materials, image } = req.body
    const [result] = await pool.query(
      'INSERT INTO artworks (title, artist, price, size, canvas, technique, materials, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, artist, price || 0, size || null, canvas || null, technique || null, materials || null, image || null]
    )
    const [rows] = await pool.query('SELECT * FROM artworks WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/artworks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { title, artist, price, size, canvas, technique, materials, image } = req.body
    await pool.query(
      'UPDATE artworks SET title = ?, artist = ?, price = ?, size = ?, canvas = ?, technique = ?, materials = ?, image = ? WHERE id = ?',
      [title, artist, price, size, canvas, technique, materials, image, id]
    )
    const [rows] = await pool.query('SELECT * FROM artworks WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Eser bulunamadı' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/artworks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await pool.query('DELETE FROM artworks WHERE id = ?', [id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── FAQ CRUD ───
app.get('/api/faq', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM faq ORDER BY id ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/faq', async (req, res) => {
  try {
    const { question, answer } = req.body
    const [result] = await pool.query('INSERT INTO faq (question, answer) VALUES (?, ?)', [question, answer])
    const [rows] = await pool.query('SELECT * FROM faq WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/faq/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { question, answer } = req.body
    await pool.query('UPDATE faq SET question = ?, answer = ? WHERE id = ?', [question, answer, id])
    const [rows] = await pool.query('SELECT * FROM faq WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Soru bulunamadı' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/faq/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await pool.query('DELETE FROM faq WHERE id = ?', [id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Sketch Lessons CRUD ───
app.get('/api/sketch-lessons', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sketch_lessons ORDER BY id ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/sketch-lessons', async (req, res) => {
  try {
    const { title, description } = req.body
    const [result] = await pool.query('INSERT INTO sketch_lessons (title, description) VALUES (?, ?)', [title, description])
    const [rows] = await pool.query('SELECT * FROM sketch_lessons WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/sketch-lessons/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { title, description } = req.body
    await pool.query('UPDATE sketch_lessons SET title = ?, description = ? WHERE id = ?', [title, description, id])
    const [rows] = await pool.query('SELECT * FROM sketch_lessons WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Ders bulunamadı' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/sketch-lessons/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await pool.query('DELETE FROM sketch_lessons WHERE id = ?', [id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Manga Lessons CRUD ───
app.get('/api/manga-lessons', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM manga_lessons ORDER BY id ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/manga-lessons', async (req, res) => {
  try {
    const { title, description } = req.body
    const [result] = await pool.query('INSERT INTO manga_lessons (title, description) VALUES (?, ?)', [title, description])
    const [rows] = await pool.query('SELECT * FROM manga_lessons WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/manga-lessons/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { title, description } = req.body
    await pool.query('UPDATE manga_lessons SET title = ?, description = ? WHERE id = ?', [title, description, id])
    const [rows] = await pool.query('SELECT * FROM manga_lessons WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Ders bulunamadı' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/manga-lessons/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await pool.query('DELETE FROM manga_lessons WHERE id = ?', [id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Offers ───
app.get('/api/offers', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM offers ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/offers', async (req, res) => {
  try {
    const { artwork_id, user_id, amount } = req.body
    const id = crypto.randomUUID()
    await pool.query(
      'INSERT INTO offers (id, artwork_id, user_id, amount, status) VALUES (?, ?, ?, ?, ?)',
      [id, artwork_id || null, user_id || null, amount, 'pending']
    )
    const [rows] = await pool.query('SELECT * FROM offers WHERE id = ?', [id])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Messages ───
app.get('/api/messages', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/messages', async (req, res) => {
  try {
    const { sender_id, receiver_id, artwork_id, content } = req.body
    const id = crypto.randomUUID()
    await pool.query(
      'INSERT INTO messages (id, sender_id, receiver_id, artwork_id, content) VALUES (?, ?, ?, ?, ?)',
      [id, sender_id || null, receiver_id || null, artwork_id || null, content]
    )
    const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [id])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Reports Analytics (SQL Aggregations) ───
app.get('/api/reports/analytics', async (_req, res) => {
  try {
    const [overall] = await pool.query('SELECT COUNT(*) as total_artworks, IFNULL(SUM(price), 0) as total_value, IFNULL(AVG(price), 0) as avg_price, IFNULL(MAX(price), 0) as max_price, IFNULL(MIN(price), 0) as min_price FROM artworks')
    const [byArtist] = await pool.query('SELECT artist, COUNT(*) as count, SUM(price) as total_value, AVG(price) as avg_price, MAX(price) as max_price FROM artworks GROUP BY artist ORDER BY total_value DESC')
    const [byTechnique] = await pool.query('SELECT technique, COUNT(*) as count, SUM(price) as total_value, AVG(price) as avg_price FROM artworks GROUP BY technique ORDER BY count DESC')
    const [byCanvas] = await pool.query('SELECT canvas, COUNT(*) as count, SUM(price) as total_value, AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price FROM artworks GROUP BY canvas ORDER BY count DESC')
    const [topArtworks] = await pool.query('SELECT * FROM artworks ORDER BY price DESC LIMIT 10')
    const [faqCount] = await pool.query('SELECT COUNT(*) as count FROM faq')
    const [sketchCount] = await pool.query('SELECT COUNT(*) as count FROM sketch_lessons')
    const [mangaCount] = await pool.query('SELECT COUNT(*) as count FROM manga_lessons')

    res.json({
      overall: overall[0],
      byArtist,
      byTechnique,
      byCanvas,
      topArtworks,
      contentStats: {
        faq: faqCount[0].count,
        sketch: sketchCount[0].count,
        manga: mangaCount[0].count
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Sanat Atölyesi MariaDB API is running at http://localhost:${PORT}`)
})
