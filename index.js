const express = require('express')
const app = express()
const port = 3000

app.get('/test', (req, res) =>  res.send('{status:200, message:"ok"}'))

app.get('/time', (req, res)  => { 
 var date = new Date();
 var time = date.getHours() + ":" + date.getSeconds();


    res.send({status:200, message: time })})


app.get('/', (req, res) => res.send('ok'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
