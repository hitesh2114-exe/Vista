const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.alternatives().try(
            Joi.string().uri(),  // for backward compatibility if string is sent
            Joi.object({
                url: Joi.string().uri().required()
            }),
            Joi.allow(null, "")  // allows empty or null if needed
        ),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
});