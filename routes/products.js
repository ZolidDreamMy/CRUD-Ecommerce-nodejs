const express = require('express');

const { check } = require('express-validator')
const router = express.Router();

const productsController = require('../controllers/products');

router.get('/', productsController.index);

// router.get('/shop', productsController.shopPage);
router.get("/cart", productsController.showCart);

// router.get("/products", productsController.products);
router.get("/shop_detail/:product_id", productsController.detailProduct);

router.get("/stock", productsController.stockproducts);
router.get('/insert', productsController.insert);

router.get('/products', productsController.getSearchProduct);
router.post('/category', productsController.selectCategory);

router.post('/addtocart', productsController.postAddtocart);


// router.get('/insert', productsController.getAddProduct);

router.get('/update/:product_id', productsController.getUpdateProduct);

// /admin/add-product => POST
router.post('/insert', [
    check('product_name').trim().not().isEmpty().withMessage("product name is required"),
    check('price').isFloat({ gt: 0 }).withMessage("greater than zero"),
    check('amount').isFloat({ gt: 0 }).withMessage("greater than zero"),
    check('category_name').trim().not().isEmpty().withMessage("product name is required"),
    check('img_path').trim().not().isEmpty().withMessage("product name is required"),
    check('description').trim().not().isEmpty().withMessage("product name is required"),
], productsController.postAddProduct);

router.post('/update', [
    check('product_id').not().isEmpty().withMessage("empty"),
    check('product_name').trim().isLength({ min: 1 }).withMessage("product name is required"),
    check('price').isFloat({ gt: 0 }).withMessage("greater than zero")
], productsController.postUpdateProduct);

router.get('/delete/:product_id', productsController.getDeleteProduct);
router.get('/deleteOrder/:product_id', productsController.getDeleteOrder);

exports.routes = router;