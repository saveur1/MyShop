import React from 'react'
import MetaData from '../layout/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../layout/Loader';
import { clearErrors, fetchLoggedOrders } from '../../actions/orderActions';
import { toast } from 'react-toastify';
import { MDBDataTable } from "mdbreact";
import { Link } from 'react-router-dom';

const ListOfOrders = () => {

    const dispatch = useDispatch();
    const { orders,loading,error } = useSelector(state=>state.myOrders);

    React.useEffect(()=>{
        dispatch(fetchLoggedOrders());

        if(error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    },[dispatch,error]);

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
        orders.forEach(order => {
            data.rows.push({
                id:order._id,
                numberOfItems:order.orderItems.length,
                amount:`$${order.totalPrice}`,
                status:order.orderStatus && String(order.orderStatus).includes("Delivered")
                                          ? <p style={{color:"green"}}>{order.orderStatus}</p>
                                          : <p style={{color:"red"}}>{ order.orderStatus }</p>,
                actions:<Link to={`/order/${order._id}`} className="btn btn-primary">
                            <i className="fa-solid fa-eye"></i>
                        </Link>
            })
        });
        return data;
    }
  return (
    <React.Fragment>
        <MetaData title="My Orders" />
        <h1 className="mt-5">My Orders</h1>
        {loading ? <Loader /> 
                 : (
                    <MDBDataTable 
                       data={feedDataTable()}
                       className="px-3"
                       bordered
                       striped
                       hover
                    />
                 )}
    </React.Fragment>
  )
}

export default ListOfOrders
