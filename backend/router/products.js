const express = require("express");
const router = express.Router();
const {CheckAuth,CheckRole} = require("../middlewares/CheckAuth");


//IMPORTING CONTROLLERS
const { 
      getProducts,
      createNewProduct, 
      getSingleProduct, 
      updateProduct, 
      deleteProducts, 
      createNewReview, 
      getAllReviews, 
      deleteUserReview, 
      getAdminProducts
} = require("../controllers/productController");


 router.route("/products/:id").get(getSingleProduct);
 router.route("/products").get(getProducts);
 router.route("/admin/products").get(CheckAuth,CheckRole("admin"),getAdminProducts);


 router.route("/admin/products/new").post(CheckAuth,CheckRole("admin"),createNewProduct);
 router.route("/admin/products/:id")
       .put(CheckAuth, updateProduct)
       .delete(CheckAuth, deleteProducts);

router.route("/review").post(CheckAuth,createNewReview);
router.route("/reviews").get(CheckAuth,getAllReviews)
                        .delete(CheckAuth,deleteUserReview);


 module.exports = router;