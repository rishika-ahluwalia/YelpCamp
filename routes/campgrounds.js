const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../views/schemas');
const {isLoggedIn, isAuthor, validateCampground}= require('../middlerware');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campground');
const multer  = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });


router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.post('/', isLoggedIn,upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

// router.post('/',upload.array('image'), (req,res)=>{
//     console.log(req.body,req.file);
//     res.send('it worked');
// });

router.get('/:id', catchAsync(campgrounds.show));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))

router.put('/:id', isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.update));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.destroy));

module.exports = router;