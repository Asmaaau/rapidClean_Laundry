const express = require('express')
const router = express.Router();
const {verifyAuth, verifyAdminAuth} = require('../middlewares/userAUTH')
const { newsLetterSubs, updateProfile } = require('../controllers/customers.controllers');


// Customers POST Requests endpoints
router.post('/saveNewsLetter', newsLetterSubs);
router.post('/updateProfile', verifyAuth, updateProfile );

module.exports = router