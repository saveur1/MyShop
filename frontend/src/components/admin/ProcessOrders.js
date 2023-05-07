import React, { Fragment,useState, useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

import MetaData from '../layout/MetaData';
import SideBar from './SideBar';
import Loader from '../layout/Loader';
import { clearErrors, orderDetails, updateOrder } from '../../actions/orderActions';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';

const ProcessOrders = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const [ status,setStatus ] = useState("Processing");

    const { order,loading } = useSelector(state => state.orderDetails);
    const { isUpdated,error } = useSelector(state => state.order);

    
    useEffect(()=>{

        dispatch(orderDetails(params.id));

        if(error){
            toast.error(error);
            dispatch(clearErrors());
        }

        if(isUpdated) {
            toast.success("Order Status Updated Successfully");
            dispatch({
                type:UPDATE_ORDER_RESET
            })
        }
    },[dispatch,params.id,error,isUpdated]);

    const address = `${order.shippingInfo && order.shippingInfo.address}, ${order.shippingInfo && order.shippingInfo.city},${order.shippingInfo && order.shippingInfo.postalCode}, ${order.shippingInfo && order.shippingInfo.country}`;
    const isPaid = order.paymentInfo && order.paymentInfo.status === "succeeded" ? true : false;

    const orderUpdateHandler = (id)=>{
        const orderData = new FormData();
        orderData.set("status",status);

        dispatch(updateOrder(id,orderData));
    }
  return (
    <Fragment>
    <MetaData title={`Process Order ${params.id}`}/>
    <div className="row">
        <div className="col-12 col-md-2">
            <SideBar />
        </div>
        <div className="col-12 col-md-10">
            {
                loading ? <Loader />
                        : <Fragment>
                          <div className="row d-flex justify-content-around">
                                <div className="col-12 col-lg-7 order-details">
                                    <h2 className="my-5">Order # {order._id}</h2>

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
                                    
                                    <div className="col-12 col-lg-3 mt-5">
                                        <h4 className="my-4">Status</h4>

                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name='status'
                                                value={status}
                                                onChange={(e)=>setStatus(e.target.value)}
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </div>

                                        <button className="btn btn-primary btn-block"  onClick={()=>orderUpdateHandler(order._id)}>
                                            Update Status
                                        </button>
                                    </div>
                            </div>
                    </Fragment>
                        }
                </div>
                </div>
                
            </Fragment>
            )
}

export default ProcessOrders
