const express = require('express')

const logger = require('morgan')
const bodyParser = require('body-parser')

const resMiddleware = require('./middleware/res')

const AppService = require('./service')
const Config = require('../config/config')

const appService = new AppService(Config)

const app = express()
app.set('json spaces', 0)
app.use(logger('dev', { skip: (req, res) => res.nolog === true || app.nolog === true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(resMiddleware)

app.get('/provision', (req, res) => res.status(200).send('#hello world'))
app.get('/', (req, res) => res.status(200).send('#hello world'))

app.use('/provision/certificate', require('./router/certificate')(appService))
app.use('/provision/token', require('./router/token')())

app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

/* eslint-disable */
app.use(function(err, req, res, next) {
  if (err) {
    console.log('::', err)
  }

  res.status(err.status || 500).json({
    code: err.code,
    message: err.message,
    where: err.where
  })
})

app.listen(80, error => {
  if (error) console.log('server start error. ', error)
  console.log('server started on port 8888')
})