const express = require('express')
const app = express()
const port = 3000
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
]

app.get(['/hello', '/hello/:id'], (req, res) => {
    res.status(200).send({status:200, message:`Hello, ${req.params.id}`}) 
})

app.get('/movie/create', (req,res) =>{
    if(req.query.title && req.query.year && req.query.year.length == 4 && !isNaN(req.query.year)){
        let newMovie={
            title: req.query.title, 
            year: req.query.year,
            rating : req.query.rating ? req.query.rating : 4}
       
            movies.push(newMovie)
            res.status(200).send({status: 200, data: movies})
            
       }else{
       
        res.status(403).send({status:403, error:true, message:'you cannot create a movie without providing a title and a year'})
       }
})

app.get('/movies/read', (req,res) =>{
    res.status(200).send( {status:200, data: movies} )
})


app.get('/movies/read/by-date' , (req, res) => {
    res.status(200).send({status:200, data: movies.sort((a,b) => b.year - a.year)})
})

app.get('/movies/read/by-rating', (req, res) => {
    res.status(200).send({status:200, data: movies.sort((a, b) => b.rating - a.rating)})
})

app.get(' /movies/read/by-title', (req,res) => {
    res.send({status:200, data: movies.sort((a,b) => a.title.localeCompare(b.title))})
})

app.get('/movies/read/id/:id', (req,res) => {
    if(req.params.id){
        if(Number(req.params.id) >=0 && (req.params.id) < movies.length){
            res.send({status:200, data:[res.params.id]})
        }
        else{
            res.status(404).send({status:404, error:true, message:`the movie ${req.params.id} does not exist`})
        }
    } else{
        res.status(500).send({status:500, error:true, message:"what is the id ...?"})
    }
})


 
app.get('/movies/update/:id', (req,res) =>{
    if(req.query.id){
   if(Numberr(req.params.id) >= 0 && req.params.id < movies.length){
    if(!req.query.title && !req.query.year && !req.query.rating){
        res.status(404).send({status:404, error:true, message:`what do you want to update?!`})
    }
    else if (req.query.year && ( req.query.year > new Date().getFullYear() || req.query.year < 1895 || req.query.year.length != 4 || isNaN(req.query.year) )){
        res.status(404).send({status:404, error:true, message:'The year is not exist'})
    }
    else if(req.query.rating && (isNaN(req.query.rating) || req.query.rating >10 || req.query.rating < 0)){
        res.status(404).send({status:404, error:true, message:'The rating is not exist'})
    }
    else{
        let Movie1={
            title : `${req.query.title || movies[req.params.id].title }`,
            year : `${req.query.year || movies[req.params.id].year}`,
            rating : `${req.query.rating || movies[req.params.id].rating}`
        }
        movies.splice(req.params.id, 1, Movie1)


        res.status(200).send({status:200, data: movies[req.params.id]})

    }
    
   }
   else{
    res.status(404).send({status:404, error:true, message:`this id : ${req.params.id} is not exist`})
}


   }
   else{
    res.status(404).send({status:404, error:true, message:`Enter the movie id`})
}
})

app.get('/movies/delete/:id', (req,res) =>{
    if(req.params.id){
        if(Number(req.params.id) >= 0 && req.params.id < movies.length){
            movies.splice(req.params.id,1);
            res.status(200).send(({status:200, data: movies}))
        }else{
            res.status(404).send({status:404, error:true, message:`The movie ${req.params.id} does not exist`})
        }
    }else{
        res.status(404).send({status:404, error:true, message:`Enter the id of the movie`})
    }
})




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


    res.status(200).send({status:200, message: time })
})





app.get('/', (req, res) => res.send('ok'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
