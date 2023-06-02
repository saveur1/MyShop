import axios from "../api/axios";
import { CREATE_ORDER_FAIL, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS,CLEAR_ERRORS, MY_ORDER_REQUEST, MY_ORDER_SUCCESS, MY_ORDER_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL, ALL_ORDER_REQUEST, ALL_ORDER_SUCCESS, ALL_ORDER_FAIL, UPDATE_ORDER_FAIL, UPDATE_ORDER_REQUEST, UPDATE_ORDER_SUCCESS, DELETE_ORDER_REQUEST, DELETE_ORDER_SUCCESS, DELETE_ORDER_FAIL } from "../constants/orderConstants"


export const createNewOrder = (order)=>async(dispatch,getState)=>{
    try {
        dispatch({
            type:CREATE_ORDER_REQUEST
        });

        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }

        const { data } = await axios.post("/order/new",order,config);

        dispatch({
            type:CREATE_ORDER_SUCCESS,
            payload:data.order
        })
    } catch (error) {
        dispatch({
            type:CREATE_ORDER_FAIL,
            payload:error.response.data.message
        })
    }
}

//get Logged user orders
export const fetchLoggedOrders = ()=>async(dispatch)=>{
    try {
        dispatch({
            type:MY_ORDER_REQUEST
        });

        const { data } = await axios.get("/orders/me");

        dispatch({
            type:MY_ORDER_SUCCESS,
            payload:data.orders
        });
    } catch (error) {
        dispatch({
            type:MY_ORDER_FAIL,
            payload:error.response.data.message
        })
    }
}

//get Order details
export const orderDetails = (id)=>async(dispatch)=>{
    try {
        dispatch({
            type:ORDER_DETAILS_REQUEST
        });

        const { data } = await axios.get(`/order/${id}`);

        dispatch({
            type:ORDER_DETAILS_SUCCESS,
            payload:data.order
        })
    } catch (error) {
        dispatch({
            type:ORDER_DETAILS_FAIL,
            payload:error.response.data.message
        })
    }
}

//get all user orders
export const allOrdersAdmin = ()=>async(dispatch)=>{
    try {
        dispatch({
            type:ALL_ORDER_REQUEST
        });

        const { data } = await axios.get("/admin/orders");

        dispatch({
            type:ALL_ORDER_SUCCESS,
            payload:data
        })
    } catch (error) {
        dispatch({
            type:ALL_ORDER_FAIL,
            payload:error.response.data.message
        })
    }
}


//update order
export const updateOrder = (id,orderData)=>async(dispatch)=>{
    try {
        dispatch({
            type:UPDATE_ORDER_REQUEST
        });

        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }

        const { data } = await axios.put(`/admin/order/${id}`,orderData,config);

        dispatch({
            type:UPDATE_ORDER_SUCCESS,
            payload:data.success
        })
    } catch (error) {
        dispatch({
            type:UPDATE_ORDER_FAIL,
            payload:error.response.data.message
        })
    }
}

//delete order
export const deleteOrder = (id)=>async(dispatch)=>{
    try {
        dispatch({
            type:DELETE_ORDER_REQUEST
        });

        const { data } = await axios.delete(`/admin/order/${id}`);

        dispatch({
            type:DELETE_ORDER_SUCCESS,
            payload:data.success
        })
    } catch (error) {
        dispatch({
            type:DELETE_ORDER_FAIL,
            payload:error.response.data.message
        })
    }
}

// clear error
export const clearErrors = () => async(dispatch)=>{
    dispatch({
        type:CLEAR_ERRORS
    });
}