const express = require('express')
const app = express()
const port = 3000
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
]

app.get(['/hello', '/hello/:id'] , (req, res) => {
    res.status(200).send({status:200, message:`Hello, ${req.params.id}`}) 
})

app.get(['/movie/create']), (req,res) =>{
    res.send()
}

app.get(['/movies/read']), (req,res) =>{
    res.send( {status:200, data: movies} )
}

app.get(['/movies/update']), (req,res) =>{
    res.send()
}

app.get(['/movies/delete']), (req,res) =>{
    res.send()
}




app.get('/search' , (req, res) => {
    if(req.query.s){
        res.status(200).send({status:200, message:"ok", data:`${req.query.s}`})
    }
    else{
        res.status(500).send({status:500, error:true, message:"you have to provide a search"} )
    }
})

app.get('/test', (req, res) =>  res.status(200).send({status:200, message:"ok"}))

app.get('/time', (req, res)  => { 
 var date = new Date();
 var time = date.getHours() + ":" + date.getSeconds();


    res.status(200).send({status:200, message: time })})


app.get('/', (req, res) => res.send('ok'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
