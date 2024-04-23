const express = require('express')
const router = express.Router();
const { verifyAdminAuth, verifyAuth } = require('../middlewares/userAUTH')
const { AdminResetPasssword, Adminsignup, Adminlogin, AdminforgotPassword, verifyAdminEmail,resendAdminVerification } = require("../controllers/admin.controllers")
const {getCustomerID, getAllCustomers} = require('../controllers/customers.controllers')


// Admin POST Requests endpoints
router.post('/register', Adminsignup )
router.post('/login', Adminlogin )
router.post('/forgotPwd', AdminforgotPassword)
router.post('/resetPwd', AdminResetPasssword)
router.post('/verifyEmail', verifyAdminEmail)
router.post('/resendMail', resendAdminVerification)

// Admin GET Requests endpoints
router.get('/getCustomerID/:cus_id', getCustomerID)
router.get('/getCustomers', verifyAuth, getAllCustomers)


module.exports = router 