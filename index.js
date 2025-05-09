const express = require('express')
require('dotenv').config()
const authRoutes = require('./src/routes/authRoutes.js')
const transactionRoutes = require('./src/routes/transactionRoutes.js')
const userRoutes = require('./src/routes/userRoutes.js')

const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use(authRoutes)
app.use(transactionRoutes)
app.use(userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
