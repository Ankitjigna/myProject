const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: {
      type: String,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;