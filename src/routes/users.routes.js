const express = require('express');
const router = express.Router();
const { create, list, getOne, update, remove, getUserPostsHandler } = require('../controllers/users.controller');
const { getLikedPostsHandler } = require('../controllers/posts.controllers');

router.get('/', list);
router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);
router.get('/:id/posts', getUserPostsHandler);
router.get('/:id/liked-posts', getLikedPostsHandler);

module.exports = router;
