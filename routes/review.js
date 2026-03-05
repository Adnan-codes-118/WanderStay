const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview,isLoggedIn,isAuthor}=require("../middleware.js");
const reviewController=require("../controller/review.js");

//post route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;