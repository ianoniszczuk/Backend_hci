const express = require('express')
require('dotenv').config()
const routes = require('./src/routes/routes.js')

const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use(routes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
