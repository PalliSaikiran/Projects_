const Joi = require('joi');

// Define listingsSchema
const listingsSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
});

// Define reviewSchema
const reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()    
});

// module.exports = {
//     listingsSchema: listingsSchema,
//     reviewSchema: reviewSchema
// };

module.exports.listingsSchema = listingsSchema;
module.exports.reviewSchema = reviewSchema;