const express = require('express');
const user = express.Router();
const { connect, mongoType } = require('../database/dbconnection');
const { userdata } = require('../models/userdata');
const { commentValidate } = require('../validate/comment');
const { successResponse, errorResponse } = require('../common/helpers');
const { emptyMessage, createdSuccessfully } = require('../common/messages');

user.post('/comment', async (req, res) => {
	await require('../common/middleware')(req, res, async () => {
		try {
			const { error } = commentValidate.validate(req.body);
			if (error) {
				return errorResponse(res, 400, {}, error.details[0].message);
			}
			await connect();
			const user = await userdata.updateOne(
				{
					_id: mongoType().ObjectId(req.body.postCreatorId),
				},
				{
					$push: {
						'posts.$[p].comments': {
							commentorId: req.reqestedUserId,
							commentorName: req.requestedFullName,
							comment: req.body.comment,
						},
					},
				},
				{
					arrayFilters: [
						{
							'p._id': mongoType().ObjectId(req.body.postId),
							$or: [
								{
									'p.commentShouldntPostAfter': { $exists: false },
									
                                },
                                {
                                    'p.commentShouldntPostAfter': { $gt: new Date() },
                                }
							],
						},
					],
				}
			);

			return user.nModified > 0
				? successResponse(res, true, req.body, createdSuccessfully)
				: errorResponse(res, 400, {}, emptyMessage);
		} catch (err) {
			return errorResponse(res, 400, {}, err.message);
		}
	});
});
module.exports = user;
