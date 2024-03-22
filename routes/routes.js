const express = require('express')
const router = express.Router();
// const { login } = require('../controllers/login')
// const { signup } = require('../controllers/signup')
const { resetPasssword } = require('../controllers/resetPassword')
const {verifyAuth} = require('../middlewares/userAUTH')
const { login, signup } = require('../controllers/auth.controllers')
const { details } = require('../controllers/users')

router.post('/signup', signup);
router.get('/login', login);
router.get('/details',verifyAuth, details);
router.post('/resetPasssword', resetPasssword);

module.exports = {router}