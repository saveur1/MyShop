const asyncCatch = require("../middlewares/asyncCatch");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//Process Stripe payment => /api/v1/payment/process
exports.processPayment = asyncCatch(async(req,res,next)=>{

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency:"usd",
        metadata:{ integration_check:"accept_a_payment" }
    });

    res.status(200).json({
        success:true,
        client_secret:paymentIntent.client_secret
    });
})

//Process Stripe payment => /api/v1/payment/process
exports.sendStipeAPI = asyncCatch(async(req,res,next)=>{

    res.status(200).json({
        stripeApiKey:process.env.STRIPE_API_KEY
    });
})