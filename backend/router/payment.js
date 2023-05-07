const express = require("express");
const { processPayment, sendStipeAPI } = require("../controllers/paymentController");
const { CheckAuth } = require("../middlewares/CheckAuth");

const router = express.Router();

router.route("/payment/process").post(CheckAuth,processPayment);
router.route("/stripeapi").get(CheckAuth,sendStipeAPI);


module.exports = router;