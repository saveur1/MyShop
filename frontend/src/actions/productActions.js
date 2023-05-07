import { 
    ALL_PRODUCTS_FAIL,
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
    CLEAR_ERRORS,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ADMIN_PRODUCTS_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,

} from "../constants/productConstants";

import axios from "../api/axios";

//get all products
export const getAllProducts = (rating=0,price,category,keyword="",currentPage=1) =>async(dispatch)=>{
    try{
        dispatch({
            type:ALL_PRODUCTS_REQUEST
        });
        let link = `/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`;

        if(category){
            link=`/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${rating}`;
        }
        const {data} = await axios.get(link);

        dispatch({
            type:ALL_PRODUCTS_SUCCESS,
            payload:data
        });

    }catch(error){

        dispatch({
            type:ALL_PRODUCTS_FAIL,
            payload:error.response.data.message || "Something went wrong while retrieving products"
        });

    }
}


//New Product
export const newProduct=(productData)=>async(dispatch)=>{
    try {
        dispatch({
            type:NEW_PRODUCT_REQUEST
        });

        const config = {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }

        const {data} = await axios.post(`/admin/products/new`,productData,config);

        dispatch({
            type:NEW_PRODUCT_SUCCESS,
            payload:data
        })
    } catch (error) {
        dispatch({
            type:NEW_PRODUCT_FAIL,
            payload:error.response.data.message
        })
    }
}

//Delete Product
export const deleteProduct=(id)=>async(dispatch)=>{
    try {
        dispatch({
            type:DELETE_PRODUCT_REQUEST
        });

        const {data} = await axios.delete(`/admin/products/${id}`);

        dispatch({
            type:DELETE_PRODUCT_SUCCESS,
            payload:data.success
        })
    } catch (error) {
        dispatch({
            type:DELETE_PRODUCT_FAIL,
            payload:error.response.data.message
        })
    }
}

//clear errors
export const clearErrors = () => async(dispatch)=>{
    dispatch({
        type:CLEAR_ERRORS
    });
}


//get single product details
export const getProductDetails=(id)=>async(dispatch)=>{
    try {
        dispatch({
            type:PRODUCT_DETAILS_REQUEST
        });

        const {data} = await axios.get(`/products/${id}`)

        dispatch({
            type:PRODUCT_DETAILS_SUCCESS,
            payload:data.product
        })
    } catch (error) {
        dispatch({
            type:PRODUCT_DETAILS_FAIL,
            payload:error.response.data.message
        })
    }
}

//Post user review
export const userReview=(reviewData)=>async(dispatch)=>{
    try {
        dispatch({
            type:NEW_REVIEW_REQUEST
        });

        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }

        const {data} = await axios.post(`/review`,reviewData,config);

        dispatch({
            type:NEW_REVIEW_SUCCESS,
            payload:data.success
        })
    } catch (error) {
        dispatch({
            type:NEW_REVIEW_FAIL,
            payload:error.response.data.message
        })
    }
}


//update product
export const updateProduct=(id,productData)=>async(dispatch)=>{
    try {
        dispatch({
            type:UPDATE_PRODUCT_REQUEST
        });

        const config = {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }

        const {data} = await axios.put(`/admin/products/${id}`,productData,config);

        dispatch({
            type:UPDATE_PRODUCT_SUCCESS,
            payload:data.success
        })
    } catch (error) {
        dispatch({
            type:UPDATE_PRODUCT_FAIL,
            payload:error.response.data.message
        })
    }
}
//get admin products
export const adminProducts = () =>async(dispatch)=>{
    try{
        dispatch({
            type:ADMIN_PRODUCTS_REQUEST
        });

        const {data} = await axios.get(`/admin/products`);

        dispatch({
            type:ADMIN_PRODUCTS_SUCCESS,
            payload:data.products
        });

    }catch(error){

        dispatch({
            type:ADMIN_PRODUCTS_FAIL,
            payload:error.response.data.message || "Something went wrong while retrieving products"
        });

    }
}

//get product reviews -> ADMIN
export const getProductReviews = (id) =>async(dispatch)=>{
    try{
        dispatch({
            type:GET_REVIEWS_REQUEST
        });

        const {data} = await axios.get(`/reviews?id=${id}`);

        dispatch({
            type:GET_REVIEWS_SUCCESS,
            payload:data.reviews
        });

    }catch(error){

        dispatch({
            type:GET_REVIEWS_FAIL,
            payload:error.response.data.message || "Something went wrong while retrieving Product Reviews"
        });

    }
}

//delete product review -> ADMIN
export const deleteProductReview = (id,productId) =>async(dispatch)=>{
    try{
        dispatch({
            type:DELETE_REVIEW_REQUEST
        });

        const {data} = await axios.delete(`/reviews?id=${id}&productId=${productId}`);

        dispatch({
            type:DELETE_REVIEW_SUCCESS,
            payload:data.success
        });

    }catch(error){

        dispatch({
            type:DELETE_REVIEW_FAIL,
            payload:error.response.data.message || "Something went wrong while Deleting Product Reviews"
        });

    }
}