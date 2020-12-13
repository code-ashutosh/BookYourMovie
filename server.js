const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3000;

// user modules
const userDB = require('./database/user');
// models
const User = require('./models/user');

// global variables
let userExist = false;
let validUser = 0;


app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(cors());
 
mongoose.connect('mongodb://localhost/MovieDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.get('/', (req,res)=>{
    res.render('index.ejs');    
});

app.get('/login', (req, res)=>{
    res.render('login.ejs',{
        validUser:validUser
    });
    validUser = 0;
});

app.get('/signup', (req, res)=>{
    res.render('signup.ejs',{
        userExist:userExist
    });
    userExist = false;
});
app.get('/home',(req, res)=>{
    if(validUser === 1){
    res.render('home.ejs');
        validUser = 2;
    }
    else
    res.redirect('/signup');
});

app.post('/login',(req, res)=>{

    const email = req.body.email;
    const password = req.body.password;
    console.log('email :>> ', email);
    console.log('password :>> ', password);


    User.findOne({email:email}).
    then(user=>{

            if(user.length === 0){
                console.log("user does not exist");
            }
            else{
                bcrypt.compare(password, user.password).then((result)=>{
                    if(result === true){
                        validUser = 1;
                        res.redirect('/home');
                    }
                    else{
                        validUser = 3;
                        res.redirect('/login');
                    }
                }).catch(err=>{
                    console.log('err :>> ', err);
                })
            }
    }).catch(err=>{
        console.log('err :>> ', err);
    });

});

app.post('/signup', (req,res)=>{    
    const email = req.body.email;
    const password = req.body.password;

    // Check if user with this email exist
     User.find({email: email}).then(user=>{
        if(user.length === 0 ){
            bcrypt.hash(password, 10).then((hashedPassword)=>{
        
                // if not then store the user
                const user =  new User({
                    email: email,
                    password : hashedPassword
                });
                user.save().then(user=>{
                    res.render('home.ejs');
                    console.log(`User Added :${user}`);
                }).catch(err=>{
                    console.log(err);
                });
            });
        }
        else{
            userExist = true;
            res.redirect('/signup');
        }
    }).catch(err=>{
        console.log('err :>> ', err);
    })
});

app.listen(PORT, ()=> console.log('Server running on port '+ PORT));