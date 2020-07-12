const Joi = require('@hapi/joi');

const commentValidate = Joi.object({
    postCreatorId: Joi.string().required(),
    comment: Joi.string().required(),
    postId: Joi.string().required(),
});
module.exports.commentValidate = commentValidate;