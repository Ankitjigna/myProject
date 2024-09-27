const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    Comment: String,
    rating: {
      type: String,
      min: 1,
      max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Review = mongoose.model("Review", reviewSchemaSchema);

module.exports = Review;