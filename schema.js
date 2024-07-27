// schema.js
const Joi = require('joi');

const listingsSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
        url: Joi.string().required(),
        filename: Joi.string().required()
    })
});

const reviewSchema = Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required()
});

module.exports = {
    listingsSchema,
    reviewSchema
};
