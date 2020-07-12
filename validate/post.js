const Joi = require('@hapi/joi');

const postValidate = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    commentShouldntPostAfter: Joi.date()
});
module.exports.postValidate = postValidate;