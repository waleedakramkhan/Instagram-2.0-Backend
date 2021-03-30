const express = require('express')
const postController = require('../controllers/post')
const authController = require('../controllers/auth')

const router = express.Router();

router.get('/', authController.requireSignIn, postController.getPosts);
router.post('/post', postController.createPost);

module.exports = router;