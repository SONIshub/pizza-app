require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT =  process.env.PORT || 4000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const  MongoDbStore = require('connect-mongo')


//database connection 

const url = 'mongodb://localhost:27017/pizza';
mongoose.connect(url,{ useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true,
    useFindAndModify : true});
    const connection = mongoose.connection;
    connection.once('open', ()=>{
        console.log('Database conncted.....');
    })
    connection.on('error',() => {
        console.log('connection failed.....');
    });

//session store




//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store:new MongoDbStore({
       mongoUrl:'mongodb://localhost:27017/pizza',
        collection:'sessions'
       }),
    saveUninitialized:false,
    cookie:{maxAge:1000 * 60 * 60 * 24} //this is calculate 24 hourse
}))

app.use(flash())

 //assest

 app.use(express.static('public'))
 app.use(express.json())

//global middleware

app.use((req,res,next)=>{
    res.locals.session = req.session
    next()
})





//set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)



app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})