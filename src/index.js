

require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors')
const { initializeSocketIO } = require('./controllers/socket_io')
const app = express()
const bodyParser = require('body-parser')

const morgan = require('morgan')

const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  app.use(cors())
  next()
})

// ...


app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))
// app.use('/images', express.static(path.resolve(__dirname, '..', '..', 'uploads')))
app.use(express.static(path.join(__dirname, '../web')))
app.use(require('./routes'))
app.use((req, res, next) => {
  const calledUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  console.log(calledUrl)
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const calledUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  console.log(calledUrl)
  res.status(error.status || 500)
  res.json({ error: error.message })
})
app.use('../uploads', express.static('../uploads'))

initializeSocketIO(io)

console.log('env',process.env.NODE_ENV)
httpServer.listen(process.env.PORT || 3005, () => {
  console.log('Server is running')
  // console.log("Hora: ", new Date());
  // verificarValidadeDeEquipamentosReservados();
})
