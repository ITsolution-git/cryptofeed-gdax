var express = require('express')
var stormpath = require('express-stormpath')
var bodyParser = require('body-parser')
var notes = require('./lib/notes.js')
var app = express()

app.use(stormpath.init(app, {
  expand: {
    customData: true,
  },
  web: {
    produces: ['application/json']
  }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))



app.get('/notes', stormpath.apiAuthenticationRequired, function(req, res) {
  res.json({notes: req.user.customData.notes || "This is your notebook. Edit this to start saving your notes!"})
})

app.post('/notes', stormpath.apiAuthenticationRequired, function(req, res) {
  if(!req.body.notes || typeof req.body.notes != "string") {
    res.status(400).send("400 Bad Request")
  }

  req.user.customData.notes = req.body.notes
  req.user.customData.save()
  res.status(200).end()
})

app.listen(3000)
