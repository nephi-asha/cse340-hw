const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const reviewController = require("../controllers/review-controller")
const invValidation = require("../utilities/inventory-validation")

router.post("/add",
    utilities.checkLogin,
    invValidation.reviewRules(),
    invValidation.checkReviewData,
    utilities.handleErrors(reviewController.addReview))

module.exports = router;