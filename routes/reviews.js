const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync= require('../utils/catchAsync');
const Review = require('../models/review');
const campgrounds = require('../routes/campgrounds');
const ExpressError = require('../utils/ExpressError');
const reviews= require('../controllers/reviews');
const Campground = require('../models/campground');

const {validateReview,isLoggedIn, isReviewAuthor}= require('../middlerware');
const review = require('../models/review');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.create))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor ,catchAsync(reviews.delete))

module.exports = router;

