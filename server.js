const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
//require('dotenv/config');

const User = require('./models/users.model');

const config = require('./config/key');

//middlewares
app.use(express.json());
app.use(cors());

//import routes

//Connect to DB
mongoose.connect(
    config.mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true},
     () => {
        console.log('connected to DB');
}).catch(err => console.error(err));

//Routes



app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)

    user.save((err, userData) => {
        if(err) return res.json({success: false, err})
        
        return res.status(200).json({success: true})
    }) 
})

///How do we start listening to the server
app.listen(3000);