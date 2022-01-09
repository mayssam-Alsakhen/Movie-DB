const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')   
const req = require('express/lib/request')
const dotenv = require("dotenv")
dotenv.config()
const port = 3000
app.use(express.json()) 



const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@moviedb.981zv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(URI)
.then(() => console.log("database connected"))
.catch(err => console.log(err));


const schemaDB = new mongoose.Schema({
    title : String,
    year : Number,
    rating : Number,
})

const moviedb = mongoose.model("moviedb", schemaDB)

moviedb.create(
    
    {title: 'Jaws', year: 1975, rating: 8},
    {title: 'Avatar', year: 2009, rating: 7.8},
    {title: 'Brazil', year: 1985, rating: 8},
    {title: 'الإرهاب والكباب', year: 1992, rating: 6.2},
)
.then()
.catch(err => console.log(err))


app.get(['/hello', '/hello/:id'], (req, res) => {
    res.status(200).send({status:200, message:`Hello, ${req.params.id}`}) 
})

app.post('/movie/create', (req,res) =>{
    if(req.query.title && req.query.year && req.query.year.length == 4 && !isNaN(req.query.year)){
        moviedb.create ({
            title: req.query.title, 
            year: req.query.year,
            rating : req.query.rating ? req.query.rating : 4})
            .then(movie => {
                res.status(200).send({status:200, data: movie})
            })
             .catch(err => console.log(err))
            // movies.push(newMovie)
            // res.status(200).send({status: 200, data: movies})
            
       }
       else{
       
        res.status(403).send({status:403, error:true, message:'you cannot create a movie without providing a title and a year'})
       }
})

app.get('/movies/read', (req,res) =>{
    // res.status(200).send( {status:200, data: movies} )
    moviedb.find()
    .then(movies => {
        res.status(200).send( {status:200, data: movies})
    })
    .catch(err => console.log(err))
})


app.get('/movies/read/by-date' , (req, res) => {
   
    moviedb.find()
    .then(movies => {
        res.status(200).send({status:200, data: movies.sort((a,b) => b.year - a.year)})
    })
    .catch(err => console.log(err))
})

app.get('/movies/read/by-rating', (req, res) => {
    // res.status(200).send({status:200, data: movies.sort((a, b) => b.rating - a.rating)})
    moviedb.find()
    .then(movies => {
        res.status(200).send({status:200, data: movies.sort((a, b) => b.rating - a.rating)})
    })
    .catch(err => console.log(err))
})

app.get(' /movies/read/by-title', (req,res) => {
    // res.send({status:200, data: movies.sort((a,b) => a.title.localeCompare(b.title))})
    moviedb.find()
    .then(movies => {
        res.send({status:200, data: movies.sort((a,b) => a.title.localeCompare(b.title))})
    })
    .catch(err => console.log(err))
})

app.get('/movies/read/:id', (req,res) => {
    if(req.params.id){
        moviedb.findById(req.params.id)
        .then(movie => {res.status(200).send({status:200, data: movie})
    })
     .catch(err => {res.status(404).send({status:404, error:true, message:`the movie ${req.params.id} does not exist`})
    })
        // if(Number(req.params.id) >=0 && (req.params.id) < movies.length){
        //     res.send({status:200, data:[res.params.id]})
        // }
        // else{
        //     res.status(404).send({status:404, error:true, message:`the movie ${req.params.id} does not exist`})
        // }

    
    }
     else{
        res.status(500).send({status:500, error:true, message:"what is the id ...?"})
    }
})


 
app.put('/movies/update/:id', (req,res) =>{
   
if(req.params.id){
    let id = req.params.id;

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
        moviedb.findById(id)
        .then(movie => {
      moviedb.findOneAndReplace({_id: id},{

        title : `${req.query.title || movie.title}`,
        year : `${req.query.year || movie.year}`,
        rating : `${req.query.rating || movie.rating}`

      })
      .then(updatemovie =>{
          if(!updatemovie)
              return res.status(200).send();
          moviedb.find()
          .then(movies => {  res.status(200).send({status:200, data: movies})
        })
        .catch(err => {console.log(err)
        })
      })
      .catch(err => {console.log(err.message)
    })
        })
       
        .catch(err =>{ res.status(404).send({status:404, error:true, message:`The ${req.params.id} does not exist`})})
    }


} })






app.delete('/movies/delete/:id', (req,res) =>{
    if(req.params.id){
       moviedb.findByIdAndDelete({_id : req.params.id})
       .then(deletemovie => {
           if(!deletemovie) return res.status(200).send(({status:200, data: movies}));
           moviedb.find()
           .then(movies => {res.status(200).send({status:200, data: movies})
       })
       .catch(err => {console.log(err)
    })
       })
     .catch(err => {console.log(err)
    })
    }
    else{
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


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
