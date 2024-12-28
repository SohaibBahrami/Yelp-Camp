import mongoose, { Types } from "mongoose";
import Review from "./review.js";
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  location: String,
  price: Number,
  image: [{ url: String, filename: String }],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Delete reviews from database using mongoose middleware (query middleware)
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

export default mongoose.model("Campground", CampgroundSchema);
