import React,{ useState,useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearErrors, deleteProductReview, getProductReviews } from '../../actions/productActions';
import MetaData from '../layout/MetaData';
import SideBar from './SideBar';
import { MDBDataTable } from 'mdbreact';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';

const ProductReviews = () => {

    const [productId,setProductId ] = useState("");
    const dispatch = useDispatch();

    const { loading,error,reviews } = useSelector(state => state.productReviews);
    const { isDeleted } = useSelector( state => state.review);

    useEffect(()=>{

        if(error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if(isDeleted){
            toast.success("Review Deleted Successfully");
            dispatch({
                type:DELETE_REVIEW_RESET
            });
            dispatch(getProductReviews(productId));
        }
    },[error,dispatch,isDeleted,productId]);

    const feedDataTable =()=>{
        const data = {
            columns:[
             {
                label:"Review ID",
                field:"id",
                sort:"asc"
             },
             {
                label:"Rating",
                field:"rating",
                sort:"asc"
             },
             {
                label:"Comment",
                field:"comment",
                sort:"asc"
             },
             {
                label:"User",
                field:"user",
                sort:"asc"
             },
             {
                label:"actions",
                field:"actions"
             }
            ],
            rows:[]
        }
        reviews && reviews.forEach(review => {
            data.rows.push({
                id:review._id,
                rating:review.rating,
                comment:review.comment,
                user:review.name,
                actions:<button type="button" className="btn btn-danger my-1 mx-2" onClick={()=>handleDeleteReview(review._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
            })
        });
        return data;
    }

    const handleDeleteReview = (id)=>{
        dispatch(deleteProductReview(id,productId));
    }

    const handleSearchReview = (e)=>{
        e.preventDefault();

        dispatch(getProductReviews(productId));
    }

  return (
    <Fragment>
    <MetaData title="Product Reviews"/>
    <div className="row">
        <div className="col-12 col-md-2">
            <SideBar />
        </div>
        <div className="col-12 col-md-10">

        <div className="row justify-content-center mt-5">
			<div className="col-5">
                <form method="POST" onSubmit={handleSearchReview}>
                    <div className="form-group">
                        <label htmlFor="productId_field">Enter Product ID</label>
                        <input
                            type="text"
                            id="email_field"
                            className="form-control"
                            value={productId}
                            onChange={(e)=>setProductId(e.target.value)}
                        />
                    </div>

                    <button
                        id="search_button"
                        type="submit"
                        className="btn btn-primary btn-block py-2"
                        disabled={loading ? true:false}
                    >
                        {loading ? "Loading...":"SEARCH"}
                    </button>
                </ form>
            </div>
            
        </div>
        {
            reviews && reviews.length > 0
                    ? <MDBDataTable 
                            data={feedDataTable()}
                            hover
                            bordered
                            className={`px-3`}
                        />
                    : <p className="pt-5 text-center">No Review Found.</p>
        }
        </div>
    </div>
    
</Fragment>
  )
}

export default ProductReviews
