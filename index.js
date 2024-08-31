require('dotenv').config()
const express = require("express");
const cors = require('cors')
const path = require("path")
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3000

const app = express();

//Connect to database
connectDB();

app.use(logger);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: true, limit: '16kb'})) //Etended true vs false

//built in middleware for json
app.use(express.json({limit: '16kb'}));

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));


//routes
app.use('/', require('./routes/root'))

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

mongoose.connection.once('open', ()=>{
  app.on('error', (error) => {
    console.error("Error Connecting to server", error.message )
  })
  app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})
})

