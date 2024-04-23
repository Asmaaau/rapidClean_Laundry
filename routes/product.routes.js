const express = require('express')
const router = express.Router();
const { verifyAdminAuth, verifyAuth } = require('../middlewares/userAUTH')
const {insertProduct, getAllProducts, getAProduct, updateAProduct, deleteProduct, getProductByCategory, setPriceList} = require('../controllers/product.controllers')
const { addCategory, getACategory, getAllCategories} = require('../controllers/category.controllers')
const { insertServices } = require('../controllers/services.controllers')


// Product POST Requests endpoints
router.post('/addProduct', insertProduct);
router.post('/addCategory', addCategory);
router.post('/updateProduct', updateAProduct);
router.post('/deleteProduct', deleteProduct);
router.post('/insert-service', insertServices);  // Services Routes


// Product GET Requests endpoints
router.get('/getCategory', getAllCategories);
router.get('/getCategoryID/:id', getACategory);
router.get('/getProductByCat', getProductByCategory);
router.get('/getProducts', getAllProducts);
router.get('/getProductID/:id', getAProduct);
router.get('/setPriceList', setPriceList);




module.exports = router