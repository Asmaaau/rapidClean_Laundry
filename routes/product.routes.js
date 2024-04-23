const express = require('express')
const router = express.Router();
const { verifyAdminAuth, verifyAuth } = require('../middlewares/userAUTH')
const {insertProduct, getAllProducts, getAProduct, updateAProduct, deleteProduct, getProductByCategory, setPriceList} = require('../controllers/product.controllers')
const { addCategory, getACategory, getAllCategories} = require('../controllers/category.controllers')
const { insertServices } = require('../controllers/services.controllers')


// Products Routes
router.post('/addProduct', insertProduct);
router.get('/getProducts', getAllProducts);
router.get('/getProductID/:id', getAProduct);
router.post('/updateProduct', updateAProduct);
router.post('/deleteProduct', deleteProduct);
router.get('/setPriceList', setPriceList);

// Category routes
router.post('/addCategory', addCategory);
router.get('/getCategory', getAllCategories);
router.get('/getCategoryID/:id', getACategory);
router.get('/getProductByCat', getProductByCategory);


// Services Routes
router.post('/insert-service', insertServices);

module.exports = router