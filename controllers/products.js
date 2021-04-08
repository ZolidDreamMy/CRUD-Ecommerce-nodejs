const { validationResult } = require('express-validator')

const mongodb = require('mongodb');
const Product = require('../models/products');
const Carts = require('../models/cart');
const ObjectId = mongodb.ObjectId;



exports.index = (req, res, next) => {
    res.render('products/', {
        pageTitle: '',
    });
}

exports.products = (req, res, next) => {
    res.render('products/products', {
        pageTitle: 'Products',
    });
}

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

// exports.shopDetail = (req, res, next) => {
//     res.render('products/shop_detail', {
//         pageTitle: 'Shopdetail',
//     });
// }
exports.insert = (req, res, next) => {
    res.render('products/insert', {
        pageTitle: '',
    });
}

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


// exports.getSearchProduct = (req, res, next) => {

//     Product.fetchAll()
//         .then(products => {
//             res.render('products/shop', {
//                 pageTitle: 'Search Product',
//                 prods: products,
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }

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