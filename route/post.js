const express = require('express');
const user = express.Router();
const { connect, mongoType } = require('../database/dbconnection');
const { userdata } = require('../models/userdata');
const { postValidate } = require('../validate/post');
const { successResponse, errorResponse } = require('../common/helpers');
const {
  emptyMessage,
  createdSuccessfully
} = require('../common/messages');

user.post('/post', async (req, res) => {
   await require('../common/middleware')(req, res, async()=>{
    try {
      const { error } = postValidate.validate(req.body);
      if (error) {
        return errorResponse(res, 400, {}, error.details[0].message);
      }
      await connect();
      const user = await userdata.updateOne( {
          _id: mongoType().ObjectId(req.reqestedUserId)
      }, {
          $push: {
            posts: req.body
          }
      })

      return user.nModified>0?successResponse(
        res,
        true,
        req.body,
        createdSuccessfully
      ): errorResponse(res, 400, {}, emptyMessage);;
    } catch (err) {
      return errorResponse(res, 400, {}, err.message);
    }
  })
});

user.get('/post', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
  try {
    await connect();
    const users = await userdata.aggregate([
      {
        $match: {
          isDeleted: false
        }
      },
      {
        $project: {
          posts: 1
        }
      },
      {
          $unwind: '$posts'
      },
      {
          $match: {
            'posts.isDeleted': false
          }
      }, 
      {
        $project: {
            postCreatorId: '$_id',
            _id:0,
            postId: '$posts._id',
            title: '$posts.title',
            description: '$posts.description',
            commentShouldntPostAfter: '$posts.commentShouldntPostAfter'
          }  
      }
    ]);
    return successResponse(res, true, users, emptyMessage);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
})
});

user.get('/post/:creatorId/:id', async (req, res) => {
  await require('../common/middleware')(req, res, async()=>{
  try {
    await connect();
    const users = await userdata.aggregate([
      {
        $match: {
          isDeleted: false,
          _id: mongoType().ObjectId(req.params.creatorId)
        }
      },
      {
        $project: {
          posts: 1
        }
      },
      {
          $unwind: '$posts'
      },
      {
          $match: {
            'posts.isDeleted': false,
            'posts._id': mongoType().ObjectId(req.params.id)
          }
      }, 
      {
        $project: {
            postId: '$posts._id',
            title: '$posts.title',
            description: '$posts.description',
            comments: '$posts.comments',
            commentShouldntPostAfter: '$posts.commentShouldntPostAfter'
          }  
      },
      {
          $unwind: {
            path: '$comments',
            preserveNullAndEmptyArrays: true}
      },
      {
          $match: {
              $expr: {
                  $ne: ['$comments.isDeleted', true]
              }
          }
      },
      {
          $group: {
              _id: '$postId',
              primaryId: {$first: '$_id'},
              title: {$first: '$title'},
              description: {$first: '$description'},
              commentShouldntPostAfter: {$first:'$commentShouldntPostAfter'},
              tempComments: {
                  $push: {
                    $cond: {
						if: { 
                            $ifNull: ['$comments._id', false],
						},
						then: {
							commentId: '$comments._id',
                            commentorId: '$comments.commentorId',
                            commentorName: '$comments.commentorName',
                            comment: '$comments.comment'
						},
						else: null,
                    },
              }},
          }
      },
      {
		$addFields: {
			comments: {
				$filter: {
					input: '$tempComments',
					as: 'd',
					cond: { $ne: ['$$d', null] },
				},
			},
		},
	},
      {
          $project: {
              postCreatorId: '$primaryId',
              postId: '$_id',
              title: 1,
              description: 1,
              commentShouldntPostAfter: 1,
              comments: 1
          }
      }
    ]);
    return successResponse(res, true, users[0], emptyMessage);
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
})
});

module.exports = user;