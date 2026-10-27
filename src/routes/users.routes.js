const express = require('express');
const Prisma = require("../db");
const router = express.Router();
const {
    create,
    list,
    getOne,
    update,
    remove
} = require('../controllers/users.controller')


router.get('/users', list)

router.post('/users', create)

router.get('/user/:id', getOne)

router.patch('/users/:id', update);

router.delete('/users/:id', remove);

module.exports = router;