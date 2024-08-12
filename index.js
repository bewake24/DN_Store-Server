require('dotenv').config()
const express = require("express");
const PORT = process.env.PORT || 3000

const app = express();

app.get('/', (req, res)=>{
    res.send("<h1>Hello From server of DN Store</h1>")
})

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})