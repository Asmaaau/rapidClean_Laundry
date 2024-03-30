const express = require('express')
const router = express.Router();
const { resetPasssword } = require('../controllers/resetPassword')
const {verifyAuth} = require('../middlewares/userAUTH')
const { login, signup, verifyUserEmail } = require('../controllers/auth.controllers')
const { details } = require('../controllers/users')
const {insertProduct, getAllProducts, getAProduct} = require('../controllers/product.controllers')
const {getCustomerID} = require('../controllers/customers.controllers')


// Users Routes
router.post('/user/register', signup);
router.get('/user/login', login);
router.get('/user/verify-email', verifyUserEmail);
router.get('/user/details',verifyAuth, details);
// router.get('/details', details);
router.post('/user/resetPasssword', resetPasssword);

// customers routes
router.get('/user/getCustomerID/:cus_id', getCustomerID)

// Products Routes
router.post('/product/addProduct', insertProduct);
router.get('/product/getProducts', getAllProducts);
router.get('/product/getProductID/:id', getAProduct);

module.exports = {router}