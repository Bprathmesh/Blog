const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User.cjs');
const Post = require('./models/Post.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const uploadMiddleware = multer({ dest: 'uploads/' });

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 4000;

app.use(cors({credentials:true, origin:process.env.FRONTEND_URL}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try {
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.error(e);
    if (e.code === 11000) {
      res.status(400).json({error: 'Username already exists'});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
});

app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  try {
    const userDoc = await User.findOne({username});
    if (!userDoc) {
      return res.status(400).json({error: 'User not found'});
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true }).json({
          id:userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json({error: 'Wrong credentials'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if (!token) {
    return res.status(401).json({error: 'Not authenticated'});
  }
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) {
      return res.status(401).json({error: 'Invalid token'});
    }
    res.json(info);
  });
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  if (!req.file) {
    return res.status(400).json({error: 'No file uploaded'});
  }
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  if (!token) {
    return res.status(401).json({error: 'Not authenticated'});
  }
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) {
      return res.status(401).json({error: 'Invalid token'});
    }
    const {title,summary,content} = req.body;
    try {
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
      });
      res.json(postDoc);
    } catch (err) {
      console.error(err);
      res.status(500).json({error: 'Failed to create post'});
    }
  });
});

app.put('/post', uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  if (!token) {
    return res.status(401).json({error: 'Not authenticated'});
  }
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) {
      return res.status(401).json({error: 'Invalid token'});
    }
    const {id,title,summary,content} = req.body;
    try {
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json({error: 'Post not found'});
      }
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(403).json({error: 'You are not the author'});
      }
      await postDoc.updateOne({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
      res.json(postDoc);
    } catch (err) {
      console.error(err);
      res.status(500).json({error: 'Failed to update post'});
    }
  });
});

app.get('/post', async (req,res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Failed to fetch posts'});
  }
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const postDoc = await Post.findById(id).populate('author', ['username']);
    if (!postDoc) {
      return res.status(404).json({error: 'Post not found'});
    }
    res.json(postDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Failed to fetch post'});
  }
});

app.delete('/posts', async (req, res) => {
  try {
    // This will delete all documents in the Post collection
    await Post.deleteMany({});
    res.json({ message: 'All posts have been deleted successfully.' });
  } catch (error) {
    console.error('Error deleting posts:', error);
    res.status(500).json({ error: 'An error occurred while deleting posts.' });
  }
});

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));