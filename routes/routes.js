const express = require('express')
const router = express.Router();
const { resetPasssword,forgotPassword } = require('../controllers/resetPassword')
const {verifyAuth} = require('../middlewares/userAUTH')
const { login, signup, verifyUserEmail, resendVerification } = require('../controllers/auth.controllers')
const {insertProduct, getAllProducts, getAProduct} = require('../controllers/product.controllers')
const {getCustomerID, getAllCustomers} = require('../controllers/customers.controllers')
const { insertServices } = require('../controllers/services.controllers')


// Users Routes
router.post('/user/register', signup);
router.get('/user/login', login);
router.get('/user/verify-email', verifyUserEmail);
// router.get('/user/details',verifyAuth, details);
router.post('/user/resetPasssword', resetPasssword);
router.get('/user/forgotPassword', forgotPassword);
router.post('/user/resend-verification', resendVerification);

// customers routes
router.get('/user/getCustomerID/:cus_id',getCustomerID)
router.get('/user/getCustomers', getAllCustomers)

// Products Routes
router.post('/product/addProduct', insertProduct);
router.get('/product/getProducts', getAllProducts);
router.get('/product/getProductID/:id', getAProduct);

// Services Routes
router.post('/services/insert-service', insertServices);


module.exports = {router}