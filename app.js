if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}


const express = require('express');
const app= express();
const path = require('path');;
const methodOverride= require('method-override');
const ejsMate= require('ejs-mate');
const Campground = require('./models/campground')
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');

const flash = require('connect-flash');
const passport= require('passport');
const LocalStrategy = require('passport-local')
const User= require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');


const session =  require('express-session');
const MongoStore = require('connect-mongo').default;


const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(mongoSanitize({
    replaceWith: '_'
}))

const mongoStore = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
    collectionName: 'session',
});

mongoStore.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store: mongoStore,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy( User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('ejs',ejsMate)
app.use((req,res,next)=>{
    
    res.locals.currentUser= req.user;
    res.locals.success= req.flash('success'); 
    res.locals.error= req.flash('error');
    next();
});




const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log('database connected');
});

app.get('/',(req,res)=>{
    res.render('home')
})


app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


app.all('*',(req,res,next)=>{
   next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const{statusCode=500}= err;
    if(!err.message) err.message='something went wrong'
    res.status(statusCode);
    res.render('error',{err});
})

const port= process.env.PORT|| 3000;

app.listen(port,()=>{
    console.log('serving on port 3000')
});

