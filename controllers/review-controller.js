const reviewModel = require("../models/review-model")

const reviewCont = {}

reviewCont.addReview = async function (req, res, next) {
    const { review_text, inv_id, account_id } = req.body
    const reviewResult = await reviewModel.addReview(review_text, inv_id, account_id)
    if (reviewResult) {
        req.flash("notice", "Review submitted successfully.")
    } else {
        req.flash("notice", "Error submitting review.")
    }
    res.redirect(`/inv/detail/${inv_id}`)
}

module.exports = reviewCont