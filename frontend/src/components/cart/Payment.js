import React from 'react';
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import CheckOutSteps from './CheckOutSteps';
import { toast } from 'react-toastify';
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from "@stripe/react-stripe-js";

import axios from '../../api/axios';
import { clearErrors, createNewOrder } from '../../actions/orderActions';
axios.defaults.withCredentials = true;

const options = {
    style:{
        base:{
            fontSize:"16px"
        },
        invalid:{
            color:"#9e2146"
        }
    }
}

const Payment = () => {

    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.auth);
    const { cartItems,shippingInfo } = useSelector(state => state.cart);
    const { error } = useSelector(state => state.orders);

    React.useEffect(()=>{
        if(error){
            toast.error(error);
            dispatch(clearErrors());
        }
    },[error,dispatch]);

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    let order = {
        shippingInfo:shippingInfo,
        orderItems:cartItems,
        itemsPrice:orderInfo.itemsPrice,
        shippingPrice:orderInfo.shippingPrice,
        taxPrice:orderInfo.taxPrice,
        totalPrice:orderInfo.totalPrice
    }

    const paymentData = {
        amount:Math.round(parseFloat(orderInfo.totalPrice)*100)
    }

    console.log(paymentData);

    const handleStripePayment=async(e)=>{
        e.preventDefault();

        document.querySelector("#pay_btn").disabled=true;

        let res;

        try {

            const config = {
                headers:{
                    "Content-Type":"application/json"
                }
            }
            res = await axios.post("/payment/process",paymentData,config);
            
            if(!stripe || !elements) {
                return;
            }

            const clientSecret = res.data.client_secret;
            const result = await stripe.confirmCardPayment(clientSecret,{
                payment_method:{
                    card:elements.getElement(CardNumberElement),
                    billing_details:{
                        name:user.name,
                        email:user.email
                    }
                }
            });

            if(result.error){
                toast.error(result.error.message);
                document.querySelector("#pay_btn").disabled =false;
            }
            else 
            {
                //Payment is succeeded or not
                if(result.paymentIntent.status==="succeeded"){
                    
                    order.paymentInfo ={
                        id:result.paymentIntent.id,
                        status:result.paymentIntent.status
                    }

                    dispatch(createNewOrder(order));
                    navigate("/success");
                }
            }
        } catch (error) {
            document.querySelector("#pay_btn").disabled=false;
            toast.error(error.response.data.message);
        }
    }
  return (
    <React.Fragment>
        <MetaData title="Payment" />
        <CheckOutSteps shipping confirmOrder payment/>
        <div className="row wrapper">
		<div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={handleStripePayment}>
                <h1 className="mb-4">Card Info</h1>
                <div className="form-group">
                  <label htmlFor="card_num_field">Card Number</label>
                  <CardNumberElement
                    type="text"
                    id="card_num_field"
                    className="form-control"
                    options={options}
                  />
                </div>
				
				<div className="form-group">
                  <label htmlFor="card_exp_field">Card Expiry</label>
                  <CardExpiryElement
                    type="text"
                    id="card_exp_field"
                    className="form-control"
                    options={options}
                  />
                </div>
				
				<div className="form-group">
                  <label htmlFor="card_cvc_field">Card CVC</label>
                  <CardCvcElement
                    type="text"
                    id="card_cvc_field"
                    className="form-control"
                    options={options}
                  />
                </div>
      
            
                <button
                  id="pay_btn"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  {`Pay - ${orderInfo.totalPrice}`}
                </button>
    
              </form>
			  </div>
        </div>
    </React.Fragment>
  )
}

export default Payment