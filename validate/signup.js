const Joi = require('@hapi/joi');

const signupValidate = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
    contact: Joi.string().required(),
    email: Joi.string().required(),
    location: Joi.string().required()
});
module.exports.signupValidate = signupValidate;