const express = require('express')
const router = express.Router();
const { verifyAdminAuth, verifyAuth } = require('../middlewares/userAUTH')
const { customerOrder, showCusOrder } = require('../controllers/orders.controllers')


// Orders POST Requests endpoints
router.post('/addOrder', verifyAuth, customerOrder);

// Orders GET Requests endpoints
router.get('/showOrder/:id', verifyAuth, showCusOrder);

module.exports = router