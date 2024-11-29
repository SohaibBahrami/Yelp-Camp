import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  location: String,
  price: Number,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

export default mongoose.model("Campground", CampgroundSchema);
