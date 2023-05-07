import React, { Fragment, useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { adminProducts, clearErrors, deleteProduct } from "../../actions/productActions";
import { MDBDataTable } from "mdbreact"
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import MetaData from '../layout/MetaData';
import SideBar from './SideBar';
import Loader from '../layout/Loader';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';

const AdminProducts = () => {

    const dispatch = useDispatch();
    const { products,error,loading } = useSelector(state => state.products);
    const { error: deleteError ,isDeleted } = useSelector(state => state.product);
    const navigate = useNavigate();

    useEffect(()=>{

        dispatch(adminProducts());

        if(error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if(deleteError) {
            toast.error(deleteError);
            dispatch(clearErrors());
        }
        if(isDeleted){
            navigate("/admin/products");
            toast.success("Product is Deleted Successfully");
            dispatch({
                type:DELETE_PRODUCT_RESET
            });
        }
    },[dispatch,error,isDeleted,deleteError,navigate]);


    const feedDataTable =()=>{
        const data = {
            columns:[
             {
                label:"ID",
                field:"id",
                sort:"asc"
             },
             {
                label:"Name",
                field:"name",
                sort:"asc"
             },
             {
                label:"Price",
                field:"price",
                sort:"asc"
             },
             {
                label:"Stock",
                field:"stock",
                sort:"asc"
             },
             {
                label:"actions",
                field:"actions"
             }
            ],
            rows:[]
        }
        products && products.forEach(product => {
            data.rows.push({
                id:product._id,
                name:product.name,
                price:`$${product.price}`,
                stock:product.stock,
                actions:<Fragment>
                            <Link to={`/admin/product/${product._id}`} className="btn btn-primary">
                                <i className="fa-solid fa-pencil"></i>
                            </Link>
                            <button type="button" className="btn btn-danger my-1 mx-2" onClick={()=>handleDeleteProduct(product._id)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
            })
        });
        return data;
    }

    const handleDeleteProduct =(id)=>{
        dispatch(deleteProduct(id));
    }
  return (
    <Fragment>
        <MetaData title="All Products"/>
        <div className="row">
            <div className="col-12 col-md-2">
                <SideBar />
            </div>
            <div className="col-12 col-md-10">

                <h1 className="my-5">All Products</h1>
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

export default AdminProducts
