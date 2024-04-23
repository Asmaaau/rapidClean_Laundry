const express = require('express')
const router = express.Router();
const {verifyAuth, verifyAdminAuth} = require('../middlewares/userAUTH')
const { login, signup, verifyUserEmail, resendVerification, resetPasssword,forgotPassword } = require('../controllers/auth.controllers')
const {insertProduct, getAllProducts, getAProduct, updateAProduct, deleteProduct, getProducstByCategory} = require('../controllers/product.controllers')
const { addCategory, getACategory, getAllCategories} = require('../controllers/category.controllers')
const { insertServices } = require('../controllers/services.controllers');

const { newsLetterSubs, updateProfile } = require('../controllers/customers.controllers');


// Auth Routes
router.post('/user/register', signup);
router.get('/user/login', login);
router.get('/user/verify-email', verifyUserEmail);
// router.get('/user/details',verifyAuth, details);
router.post('/user/resetPasssword', resetPasssword);
router.get('/user/forgotPassword', forgotPassword);
router.post('/user/resend-verification', resendVerification);
router.post('/user/saveNewsLetter', newsLetterSubs);

router.post('/user/updateProfile', verifyAuth, updateProfile );






module.exports = {router}