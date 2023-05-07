import React, { Fragment, useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { MDBDataTable } from "mdbreact"
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import MetaData from '../layout/MetaData';
import SideBar from './SideBar';
import Loader from '../layout/Loader';
import { allOrdersAdmin,clearErrors, deleteOrder } from '../../actions/orderActions';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';

const OrdersList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders,error,loading } = useSelector(state => state.allOrders);
    const { isDeleted } = useSelector( state => state.order);

    useEffect(()=>{

        dispatch(allOrdersAdmin());

        if(error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if(isDeleted) {
            navigate("/admin/orders");
            toast.success("Order is Deleted Successfully");
            dispatch({ type:DELETE_ORDER_RESET });
        }

    },[dispatch,error,isDeleted,navigate]);


    const feedDataTable =()=>{
        const data = {
            columns:[
             {
                label:"Order ID",
                field:"id",
                sort:"asc"
             },
             {
                label:"Num of Items",
                field:"numberOfItems",
                sort:"asc"
             },
             {
                label:"Amount",
                field:"amount",
                sort:"asc"
             },
             {
                label:"Status",
                field:"status",
                sort:"asc"
             },
             {
                label:"actions",
                field:"actions",
                sort:"asc"
             }
            ],
            rows:[]
        }
        orders && orders.forEach(order => {
            data.rows.push({
                id:order._id,
                numberOfItems:order.orderItems.length,
                amount:`$${order.totalPrice}`,
                status:order.orderStatus && String(order.orderStatus).includes("Delivered")
                                          ? <p style={{color:"green"}}>{order.orderStatus}</p>
                                          : <p style={{color:"red"}}>{ order.orderStatus }</p>,
                actions:<Fragment>
                            <Link to={`/admin/order/${order._id}`} className="btn btn-primary">
                                <i className="fa-solid fa-eye"></i>
                            </Link>
                            <button type="button" className="btn btn-danger my-1 mx-2" onClick={()=>handleDeleteOrder(order._id)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
            })
        });
        return data;
    }

    const handleDeleteOrder = (id)=>{
        dispatch(deleteOrder(id));
    }
  return (
    <Fragment>
        <MetaData title="Admin Orders"/>
        <div className="row">
            <div className="col-12 col-md-2">
                <SideBar />
            </div>
            <div className="col-12 col-md-10">

                <h1 className="my-5">All Orders</h1>
            {
                loading ? <Loader /> 
                        : <MDBDataTable 
                                data={feedDataTable()}
                                hover
                                bordered
                                className={`px-3`}
                            />
            }
            </div>
        </div>
        
    </Fragment>
  )
}

export default OrdersList
 