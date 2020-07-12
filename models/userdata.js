const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: [
      {
      password: {
        type: String,
      },
      isDeleted: {
        type: Boolean,
        default: false
      }
    }
    ]
  },
  fullname: {
    type: String
  },
  email: {
    type: String
  },
  location: {
    type: String
  },
  contact: {
    type: String
  },
  posts: {
    type: [
      {
        title: {
          type: String
        },
        description: {
          type: String
        },
        commentShouldntPostAfter: {
          type: Date
        },
        topCommenter: {
          type: {
            commentorId: { 
              type: String
            },
            commentorName: { 
              type: String
            },
          }
        },
        comments: {
          type:[
            {
              commentorId: { 
                type: String
              },
              commentorName: { 
                type: String
              },
              comment: {
                type: String
              },
              voteCount: {
                type: Number,
                default: 0
              },
              level: {
                type: Number,
                default: 1
              },
              isDeleted: {
                type: Boolean,
                default: false
              }
            } 
          ]
        },
        isDeleted: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false // You should be aware of the outcome after set to false
});
userSchema.plugin(uniqueValidator);
const userdata = mongoose.model('userdata', userSchema);
module.exports.userdata = userdata;
