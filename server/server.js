const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//require('dotenv/config');

const User = require('./models/users.model');
const auth = require('./middleware/auth');

const config = require('./config/key');

//middlewares
app.use(express.json());
app.use(cookieParser());
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
app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role 
    })
})


app.post('/api/users/register', async (req, res) => {
    const user = new User(req.body)

    try{
        const savedUser = await user.save();
        res.send(savedUser);
    } catch(err) {
        res.status(400).send(err)
    }

    /*user.save((err, userData) => {
        if(err) return res.json({success: false, err})
        
        return res.status(200).json({success: true})
    }) */
})

app.post('/api/users/login', (req, res) => {
    //find the email
    //const user = new User(req.body)
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) 
            return res.json({
            loginSuccess: false,
            message: "Auth failed, email not found"
        });
        //compare password
        user.comparePassword(req.body.password, (err, isMatch) =>{
            if(!isMatch){
                return res.json({loginSuccess: false, message: "wrong password"})
            }
        });

        //generateToken
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            res
                .cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true
                })
        })
    })
});

//logout: ponemos el token en blanco
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id}, { token: ""}, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})

///How do we start listening to the server
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server Runing at ${port}` )
});