const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const user = require('./route/user');
const auth = require('./route/auth');
const post = require('./route/post');
const comment = require('./route/comment');
app.use('/api', user);
app.use('/api', auth);
app.use('/api', post);
app.use('/api', comment);

app.get('/', function (req, res) {
  let resString = '<div><h2>BSTest API</h2></div>';
    resString+=`<p>Post: (/api/signin) <a href='/api/signin'>Sign In (username:' ', password:' ')</a></p>`;
    resString+=`<p>Post: (/api/signup) <a href='/api/user'>Create new user(username:' ', password:' ',fullname:' ',contact:' ',email:' ',location:' ')</a></p>`;
    resString+=`<p>Post: (/api/post) <a href='/api/post'>Create new post(title:' ', description:' ')</a></p>`;
    resString+=`<p>Get: (/api/post) <a href='/api/post'>Get posts</a></p>`;
    resString+=`<p>Post: (/api/comment) <a href='/api/comment'>Post comments(postCreatorId:'',postId:'',comment: '')</a></p>`;
    res.send(resString);
  })
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
