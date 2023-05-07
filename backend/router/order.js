const express = require("express");
const router = express.Router();

const { createNewOrder, getSingleOrder, getLoggedOrders, getAllOrders, updateSingleOrder, deleteOrder } = require("../controllers/orderController");
const { CheckAuth, CheckRole } = require("../middlewares/CheckAuth");


router.route("/order/new").post( CheckAuth,createNewOrder );

router.route("/orders/me").get( CheckAuth,getLoggedOrders );
router.route("/order/:id").get( CheckAuth,getSingleOrder );

router.route("/admin/orders").get(CheckAuth,CheckRole("admin"),getAllOrders);
router.route("/admin/order/:id").put(CheckAuth,CheckRole("admin"),updateSingleOrder)
                                .delete(CheckAuth,CheckRole("admin"),deleteOrder);


module.exports = router;