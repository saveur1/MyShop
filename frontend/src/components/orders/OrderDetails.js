import React, { Fragment } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { clearErrors, orderDetails } from '../../actions/orderActions';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import Loader from '../layout/Loader';

const OrderDetails = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const { error,loading,order } = useSelector(state=>state.orderDetails);

    React.useEffect(()=>{
        dispatch(orderDetails(params.id));

        if(error){
            toast.error(error);
            dispatch(clearErrors());
        }
    },[error,dispatch,params.id])

    console.log(order);

    const address = `${order.shippingInfo && order.shippingInfo.address}, ${order.shippingInfo && order.shippingInfo.city},${order.shippingInfo && order.shippingInfo.postalCode}, ${order.shippingInfo && order.shippingInfo.country}`;
    const isPaid = order.paymentInfo && order.paymentInfo.status === "succeeded" ? true : false;
  return (
    <React.Fragment>
       {
        loading ? <Loader /> 
                : (
                    <Fragment>
                    <div className="row d-flex justify-content-between">
                      <div className="col-12 col-lg-8 mt-5 order-details">

                        <h1 className="my-5">Order # {order._id}</h1>

                        <h4 className="mb-4">Shipping Info</h4>
                        <p><b>Name:</b> {order.user && order.user.name}</p>
                        <p><b>Phone:</b> {order.shippingInfo && order.shippingInfo.phone}</p>
                        <p className="mb-4"><b>Address:</b>{ address }</p>
                        <p><b>Amount:</b> ${order && order.totalPrice}</p>

                        <hr />

                        <h4 className="my-4">Payment</h4>
                        <p className={isPaid ? "greenColor" : " redColor"} ><b>{isPaid ? "PAID" : "UN PAID"}</b></p>


                        <h4 className="my-4">Order Status:</h4>
                        <p className={order.orderStatus && String(order.orderStatus).includes("Delivered") ? "greenColor" : "redColor"} ><b>{order && order.orderStatus}</b></p>


                        <h4 className="my-4">Order Items:</h4>

                        {
                            order.orderItems && order.orderItems.map(item=>(
                                <Fragment key={item.product}>
                                    <hr />
                                    <div className="cart-item my-1">
                                        <div className="row my-5">
                                            <div className="col-4 col-lg-2">
                                                <img src={item.image} alt={item.name} height="45" width="65" />
                                            </div>

                                            <div className="col-5 col-lg-5">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>


                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p>${item.price}</p>
                                            </div>

                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <p>{item.quantity} Piece(s)</p>
                                            </div>
                                            </div>
                                        </div>
                                </Fragment>
                            ))
                        }
                            <hr />
                        </div>
                    </div>
                    </Fragment>
                )
       }
    </React.Fragment>
  )
}

export default OrderDetails
