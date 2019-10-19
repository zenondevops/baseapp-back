require('dotenv').config()

const express = require('express')
const app = express()
const config = require('./config')
const crypto = require('crypto')
const rp = require('request-promise-native')
const bodyParser = require('body-parser')
const db = require('mysql2-promise')()

app.use(bodyParser.json({limit: '8mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '8mb', extended: true}))

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.app.clientUrl)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, X-Requested-With, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Origin')
  next()
})

app.get('/heathcheck', (req, res) => {
  res.json({ error: null, message: 'Back-end is running...' })
})

app.get('/db', (req, res) => {
 
  db.configure({
    host: config.db.host,
    user: config.db.user,
    password: config.db.pass,
    database: config.db.name
  })

  try {
    db.query('SELECT * FROM users').spread(users => {
      res.json({ error: null, data: users })
    })
  } catch (err) {
    res.json({ error: true, data: err })
  }
})

app.get('/www', async (req, res) => {
  try {
    const posts = await rp('https://jsonplaceholder.typicode.com/posts')
    res.json({ error: null, data: JSON.parse(posts) })
  } catch (err) {
    res.json({ error: true, data: err })
  }
})

app.get('/crypto', (req, res) => {
  let i = 10000
  let hashes = []
  
  while (i !== 0) {
    const random = crypto.randomBytes(512).toString('hex')
  const hash = crypto.pbkdf2Sync(random, 'jeansel', 1000, 64, `sha512`).toString(`hex`)

    hashes = [hash, ...hashes]
    i--
  }

  res.json({ error: null, data: { hashes: hashes } })
})


app.listen(config.app.port, () => {
  console.log(`Listening on port ${ config.app.port }...`)
})
