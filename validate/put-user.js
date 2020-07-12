const Joi = require('@hapi/joi');

const putUserValidate = Joi.object({
    fullname: Joi.string(),
});
module.exports.putUserValidate = putUserValidate;