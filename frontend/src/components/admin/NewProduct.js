import {Fragment,useState,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearErrors, newProduct } from '../../actions/productActions';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';

import SideBar from './SideBar';
import MetaData from '../layout/MetaData';

const NewProduct = () => {

    const [ name,setName ] = useState("");
    const [ price,setPrice ] = useState(0);
    const [ description,setDescription ] = useState("");
    const [ category,setCategory ] = useState("Electronics");
    const [ stock,setStock ] = useState(0);
    const [ seller,setSeller ] = useState("");
    const [ images,setImages ] = useState([]);
    const [ imagesPreview,setImagesPreview ] = useState([]);

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

    const { loading,success,error } = useSelector(state => state.newProduct);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        if(error){
            toast.error(error);
            dispatch(clearErrors());
        }

        if(success) {
            navigate("/admin/products");
            toast.success("New Product Created Successfully");
            dispatch({
                type:NEW_PRODUCT_RESET
            })
        }
    },[dispatch,error,success,navigate]);

    const submitHandler = (e)=>{
        e.preventDefault();
        const productData = new FormData();

        productData.set("name",name);
        productData.set("price",price);
        productData.set("description",description);
        productData.set("category",category);
        productData.set("seller",seller);
        productData.set("stock",stock);

        images.forEach(image =>{
            productData.append("images",image);
        });
        console.log(category);

        dispatch(newProduct(productData));
    }

    const uploadImages = (e)=>{
        const files = Array.from(e.target.files);

        setImages([]);
        setImagesPreview([]);

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = ()=>{
                if(reader.readyState === 2) {
                    setImagesPreview(prevImage => [...prevImage, reader.result]);
                    setImages(prevImage => [...prevImage, reader.result]);
                }
            }

            reader.readAsDataURL(file);
        })
    }
 
  return (
    <Fragment>
        <MetaData title="New Product"/>
        <div className="row">
            <div className="col-12 col-md-2">
                <SideBar />
            </div>
            <div className="col-12 col-md-10">
              <div className="wrapper my-5"> 
                <form className="shadow-lg" onSubmit={ submitHandler } encType='multipart/form-data'>
                    <h1 className="mb-4">New Product</h1>

                    <div className="form-group">
                    <label htmlFor="name_field">Name</label>
                    <input
                        type="text"
                        id="name_field"
                        className="form-control"
                        value={ name }
                        onChange={(e)=>setName(e.target.value)}
                    />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price_field">Price</label>
                        <input
                        type="text"
                        id="price_field"
                        className="form-control"
                        value={ price }
                        onChange={(e)=>setPrice(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description_field">Description</label>
                        <textarea 
                            className="form-control" 
                            id="description_field" 
                            rows="8"
                            value={ description }
                            onChange={(e)=>setDescription(e.target.value)}
                            ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_field">Category</label>
                        <select 
                           className="form-control" 
                           id="category_field"
                           value={ category }
                           onChange={(e)=>setCategory(e.target.value)}
                           >
                            {
                                categories.map(category => (
                                    <option
                                      key={ category }
                                      value={category}
                                      >
                                        {category}
                                    </option>
                                ))
                            }
                            
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock_field">Stock</label>
                        <input
                        type="number"
                        id="stock_field"
                        className="form-control"
                        value={ stock }
                        onChange={(e)=>setStock(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="seller_field">Seller Name</label>
                        <input
                        type="text"
                        id="seller_field"
                        className="form-control"
                        value={ seller }
                        onChange={(e)=>setSeller(e.target.value)}
                        />
                    </div>
                    
                    <div className='form-group'>
                        <label>Images</label>
                        
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='product_images'
                                    className='custom-file-input'
                                    id='customFile'
                                    onChange={uploadImages}
                                    multiple
                                />
                                <label className='custom-file-label' htmlFor='customFile'>
                                    Choose Images
                                </label>
                            </div>
                            {
                                imagesPreview.map(image =>(
                                    <img src={image} key={image} alt="file preview" className="mt-3 mr-2" width="55" height="52" />
                                ))
                            }
                    </div>

        
                    <button
                    id="login_button"
                    type="submit"
                    className="btn btn-block py-3"
                    disabled={loading ? true:false}
                    >
                    { loading ? "Loading..." : "CREATE" }
                    </button>

                </form>
            </div>
            </div>
        </div>
    </Fragment>
  )
}

export default NewProduct
