const express = require('express')
const router = express.Router();
const { login } = require('../controllers/login')
const { signup } = require('../controllers/signup')
const { resetPasssword } = require('../controllers/resetPassword')
// const {} = require('')

router.post('/signup', signup);
router.get('/login', login);
router.post('/resetPasssword', resetPasssword);
// router.get('/changePwd', changePassword);

module.exports = {router}