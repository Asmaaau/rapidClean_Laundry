const express = require('express')
const router = express.Router();
const { verifyAdminAuth, verifyAuth } = require('../middlewares/userAUTH')
const { customerOrder } = require('../controllers/orders.controllers')

router.post('/addOrder', customerOrder);

module.exports = router