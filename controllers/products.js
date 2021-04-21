const { validationResult } = require('express-validator')

const mongodb = require('mongodb');
const Product = require('../models/products');
const Carts = require('../models/cart');
const ObjectId = mongodb.ObjectId;


// ทำการ render ไปที่หน้าหลัก
exports.index = (req, res, next) => {
    res.render('products/', {
        pageTitle: '',
    });
}
// ทำการ render ไปที่หน้า products
exports.products = (req, res, next) => {
    res.render('products/products', {
        pageTitle: 'Products',
    });
}
// ทำการ render ไปที่หน้า cart
exports.showCart = (req, res, next) => {
    Carts.fetchAll()
        .then(products => { 
            console.log(products);
            res.render('products/cart', {
                pageTitle: 'Cart',
                prods: products,
            });
        })
        .catch(err => {
            console.log(err);
        });
}

// ทำการ render ไปที่หน้า insert ข้อมูล
exports.insert = (req, res, next) => {
    res.render('products/insert', {
        pageTitle: '',
    });
}
// ทำการส่งข้อมูลไปยังหน้า stock เพื่อทำการแสดง
exports.stockproducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => { 
            res.render('products/stock', {
                pageTitle: 'Search stock',
                prods: products,
            });
        })
        .catch(err => {
            console.log(err);
        });
}

// ทำการส่งข้อมูลไปยังหน้า products เพื่อทำการแสดง
exports.getSearchProduct = (req, res, next) => {

    Product.fetchAll()
        .then(products => {
            console.log(products);
            res.render('products/products', {
                pageTitle: 'Products',
                prods: products,
            });
        })
        .catch(err => {
            console.log(err);
        });
}
// ทำการรับค่าตามตัวแปรที่กำหนด และทำการนำไปแสดงในหน้า shop_detail
exports.detailProduct = (req, res, next) => {
    console.log(req.params);
    const { product_id } = req.params;
    let product_name = '';
    let price = '';
    let description = '';
    let img_path = '';
    let category_name = '';

    Product.findById(product_id)
        .then(product => {
            // console.log(product);
            product_name = product.product_name;
            price = product.price;
            description = product.description;
            img_path = product.img_path;
            category_name = product.category_name;

            res.render('products/shop_detail', {
                errorMessage: null,
                product_id: product_id,
                product_name: product_name,
                price: price,
                // amount:amount,
                category_name:category_name,
                img_path:img_path,
                description:description
                
            });
            console.log(category_name);
        })
        .catch(err => console.log(err));
};

exports.selectCategory = (req, res, next) => {
    const { orderby } = req.body;
    
    Product.fetchCategory(orderby)
        .then(products => {
            res.render('products/products', {
                prods: products,
            });
        })
        .catch(err => {
            console.log(err);
        });
};
// ทำการส่งแบบ post เพื่อที่จะทำการ insert ข้อมูลในหน้า AddtoCart
exports.postAddtocart = (req, res, next) => {
    console.log(req.body);
    const { product_name,price,amount,img_path} = req.body;
    const product = new Carts(product_name,price,amount,img_path);
    product
        .save()
        .then(result => {
            // console.log(result);
            console.log('AddtoCart');
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });

};
// ทำการส่งแบบ get เพื่อที่จะทำการ insert ข้อมูลในหน้า AddtoCart
exports.getAddProduct = (req, res, next) => {
    const product_name = '';
    const price = '';
    const amount = '';
    const category_name = '';
    const img_path = '';
    const description = '';
    res.render('insert', {
        pageTitle: 'Insert Product',
        errorMessage: null,
        product_name: product_name,
        price: price,
        amount:amount,
        category_name:category_name,
        img_path:img_path,
        description:description
    });
};

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const { product_name,price,amount,img_path,category_name,description,images} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('stock', {
            pageTitle: 'Insert Product',
            errorMessage: errors.array(),
            product_name: product_name,
            price: price,
            amount:amount,
            category_name:category_name,
            img_path:img_path,
            description:description
        });
    }

    const product = new Product(product_name,price,amount,img_path,category_name,description);
    product
        .save()
        .then(result => {
            // console.log(result);
            console.log('Created Product');
            res.redirect('/stock');
        })
        .catch(err => {
            console.log(err);
        });

};

// ทำการส่งแบบ get เพื่อที่จะทำการ update ข้อมูลในหน้า products
exports.getUpdateProduct = (req, res, next) => {
    console.log(req.params);
    const { product_id } = req.params;
    let product_name = '';
    let price = '';
    let amount = '';
    let category_name = '';
    let img_path = '';
    let description = '';

    Product.findById(product_id)
        .then(product => {
            

            console.log(product);
            product_name = product.product_name;
            price = product.price;
            amount = product.amount;
            category_name = product.category_name;
            description = product.description;
            img_path = product.img_path;
            res.render('products/update', {
                pageTitle: 'Update Product',
                errorMessage: null,
                product_id: product_id,
                product_name: product_name,
                price: price,
                amount:amount,
                category_name:category_name,
                img_path:img_path,
                description:description
            });
        })
        .catch(err => console.log(err));
};

// ทำการส่งแบบ post เพื่อที่จะทำการ update ข้อมูลในหน้า products
exports.postUpdateProduct = (req, res, next) => {
    console.log(req.body);
    const { product_id,product_name,price,amount,img_path,category_name,description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('products/update', {
            pageTitle: 'Update Product',
            errorMessage: errors.array(),
            product_id: product_id,
            product_name: product_name,
            price: price,
            amount:amount,
            category_name:category_name,
            img_path:img_path,
            description:description
        });
    }

    const product = new Product(product_name,price,amount,img_path,category_name,description, new ObjectId(product_id));
    product
        .save()
        .then(result => {
            console.log('Update Product');
            res.redirect('/stock');
        })
        .catch(err => console.log(err));
};

// ทำการ Delete ตาม product_id ที่ระบุ
exports.getDeleteProduct = (req, res, next) => {
    const { product_id } = req.params;
    console.log(product_id);
    Product.deleteById(product_id)
        .then(() => {
            console.log('Delete Product');
            res.redirect('/stock'); 
        })
        .catch(err => console.log(err));
};

// ทำการ Delete หน้า order ตาม product_id ที่ระบุ
exports.getDeleteOrder = (req, res, next) => {
    const { product_id } = req.params;
    console.log(product_id);
    Carts.deleteById(product_id)
        .then(() => {
            console.log('Delete Product');
            res.redirect('/stock'); 
        })
        .catch(err => console.log(err));
};