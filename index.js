require('dotenv').config()
const express = require("express");
const path = require("path")
const PORT = process.env.PORT || 3000

const app = express();

app.use(express.urlencoded({extended: false}))

//built in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?', (req, res)=>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/*', (req, res)=>{
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})


// Chain Route handler not added. Dave gray Node.js Episode-06
// Issue to Resolve
//      Change the route to /error when any error route is requested.