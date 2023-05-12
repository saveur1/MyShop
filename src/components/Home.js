import React,{Fragment,useEffect, useState} from 'react';

import MetaData from './layout/MetaData';
import Product from './product/Product';
import Loader from './layout/Loader';
import Pagination from "react-js-pagination";
import Slider from "rc-slider";

import 'react-toastify/dist/ReactToastify.css';
import 'rc-slider/assets/index.css';

import { useDispatch,useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllProducts } from '../actions/productActions';

const createSliderWithTooltip=Slider.createSliderWithTooltip;
const Range =createSliderWithTooltip(Slider.Range);


export default function Home() {

  const [currentPage,setCurrentPage]=useState(1);
  const [price,setPrice] = useState([1,10000]);
  const [category,setCategory] = useState("");
  const [rating,setRating]=useState(0);
  const { keyword } = useParams();

  const { products,loading,productsCount,error,resultPerPage,filteredProductsCount } = useSelector((state)=>state.products);

  const dispatch = useDispatch();


  const categories=[
      "Electronics",
      "Cameras",
      "Laptops",
      "Accessories",
      "Headphones",
      "Food",
      "Books",
      "Clothes/Shoes",
      "Beauty/Health",
      "Sports",
      "Outdoor",
      "Home"
  ];

  useEffect(() => {
        if(error){
          return toast.error(error);
        }
        
        dispatch(getAllProducts(rating,price,category,keyword,currentPage));

  }, [dispatch,error,currentPage,keyword,price,category,rating]);
  

  function setCurrentPageNumber(pageNumber){
    setCurrentPage(pageNumber);
  }
  let counts=productsCount;
  if(category){
    counts=filteredProductsCount;
  }
  return (
    <Fragment>
      <MetaData title="Buy Best Product Online!!"/>

      {
        loading ? <Loader />:(
          <Fragment>
            <h1 id="products_heading">Latest Products</h1>
            <section id="products" className="container mt-5">
                <div className="row">
                  {
                    keyword ? (
                    <Fragment>
                        <div className="col-6 col-md-3 mt-5 mb-5 mb-5">
                           <div className="px-5">
                             <Range 
                               marks={{
                                 1:`1$`,
                                 10000:"$10000"
                               }}
                               min={1}
                               max={10000}
                               defaultValue={[1,10000]}
                               tipFormatter={(value)=>`$${value}`}
                               tipProps={{
                                  placement:"top",
                                  visible:true
                               }}
                               value={price}
                               onChange={(price)=>setPrice(price)}
                             />                           
                           </div>

                           <div className="mt-5 px-5">
                              <hr className="pt-5"/>
                              <h4 className="mx-0 px-0">Categories</h4>
                              {
                                categories.map(category=>(
                                    <li 
                                      style={{
                                        listStyleType:"none",
                                        cursor:"pointer",
                                        padding:"5px 0px"
                                      }}
                                      key={category}
                                      className="hover_color"
                                      onClick={()=>setCategory(category)}
                                      >
                                        {category}
                                    </li>
                                ))
                              }
                           </div>

                           <div className="mt-5 px-5">
                              <hr className="pt-5"/>
                              <h4 className="mx-0 px-0">Ratings</h4>
                              {
                                [5,4,3,2,1].map(star=>(
                                    <li 
                                      style={{
                                        listStyleType:"none",
                                        cursor:"pointer",
                                        padding:"5px 0px"
                                      }}
                                      key={star}
                                      onClick={()=>setRating(star)}
                                      >
                                        <div className="rating-outer">
                                          <div className="rating-inner" 
                                                    style={{
                                                      width:`${star*20}%`
                                                    }}
                                                    >
                                          </div>
                                        </div>
                                    </li>
                                ))
                              }
                           </div>
                        </div>
                        <div className="col-6 col-md-9">
                          <div className="row">
                            {
                              products && products.map((product) => (
                                <Product key={product._id} product={product} col={4}/>
                            ))
                            }
                          </div>
                        </div>
                    </Fragment>) : (
                      products && products.map((product) => (
                        <Product key={product._id} product={product} col={3}/>
                    )))
                  }
              </div>
          </section>
          {
            resultPerPage <= counts && (
              <div className="d-flex justify-content-center mt-5">           
                <Pagination 
                    activePage={currentPage}
                    totalItemsCount={productsCount || 0}
                    itemsCountPerPage={resultPerPage}
                    onChange={setCurrentPageNumber}
                    prevPageText="Prev"
                    nextPageText="Next"
                    firstPageText="First"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                    />         
              </div>
            )
          }
          </Fragment>
        )
      }
    </Fragment>
  )
}