//entry point for our backend

const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://lpilas:test@cluster0-zed4h.mongodb.net/test?retryWrites=true&w=majority", 
    {useNewUrlParser: true}).then(() => console.log('DB connected'))
                            .catch(err => console.log(err));

//respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world');
});



app.listen(5000);