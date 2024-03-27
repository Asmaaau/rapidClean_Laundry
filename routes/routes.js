const express = require('express')
const router = express.Router();
const { resetPasssword } = require('../controllers/resetPassword')
const {verifyAuth} = require('../middlewares/userAUTH')
const { login, signup } = require('../controllers/auth.controllers')
const { details } = require('../controllers/users')
const {insertProduct} = require('../controllers/product.controllers')

router.post('/signup', signup);
router.get('/login', login);
// router.get('/details',verifyAuth, details);
router.get('/details', details);
router.post('/resetPasssword', resetPasssword);
router.post('/addProduct', insertProduct);

module.exports = {router}