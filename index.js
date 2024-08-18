require('dotenv').config()
const express = require("express");
const cors = require('cors')
const path = require("path")
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3000

const app = express();

app.use(logger);

//Cross Origin Resource Sharing
const whiteList = ['https://valeff.com', 'http://localhost:6001'] //Remove these development websites when going into production
const corsOptions = {
  origin: (origin, callback) => {
    if(whiteList.indexOf(origin) !== -1 || !origin){ //remove !origin while going into production
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}))

//built in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.all("*", (req, res) => {
    // res.redirect("/404.html")
    
    if (req.accepts('html')){
      res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts('json')){
      res.json({error: '404 Not found'})
    } else {
      res.type('txt').send('404 not found')
    }
  });

app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})


// Chain Route handler not added. Dave gray Node.js Episode-06
// Issue to Resolve
//      Change the route to /error when any error route is requested.