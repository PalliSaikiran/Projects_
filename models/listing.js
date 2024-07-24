    const mongoose = require("mongoose");
    const { Schema } = mongoose;
    const Review = require("./review");
    const User = require("./user")


    // Mongoose schema for listings
    const listingsSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
        owner: { type: Schema.Types.ObjectId, ref: 'User' }
    });

    // Post middleware to delete associated reviews when a listing is deleted
    listingsSchema.post("findOneAndDelete", async (listing) => {
        if (listing) {
            await Review.deleteMany({ _id: { $in: listing.reviews } });
        }
    });
    const Listing = mongoose.model("Listing", listingsSchema);

    module.exports = Listing;