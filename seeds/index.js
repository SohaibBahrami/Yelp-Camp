import Campground from "../models/campground.js";
import cities from "./city.js";
import { descriptors, places } from "./seedHelpers.js";
// importing mongoose
import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// choosing names by random
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 80) + 10;
    const camp = new Campground({
      author: "6759d00f7edf579ab6738d57",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price: price,
      image: [
        {
          url: `https://loremflickr.com/750/500?random=${Math.floor(
            (Math.random() + 1) * 100
          )}`,
          filename: "YelpCamp",
        },
      ],
    });
    await camp.save().catch((err) => {
      console.error("Error saving campground:", err);
    });
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
