import React from 'react';
import { useSelector,useDispatch } from "react-redux";
import { countries } from "countries-list"
import { saveShippinInfo } from '../../actions/cartActions';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import CheckOutSteps from './CheckOutSteps';

const Shipping = () => {
    const { shippingInfo } = useSelector(state=>state.cart);
    
    const [ address,setAddress ] = React.useState(shippingInfo ? shippingInfo.address : "");
    const [ city,setCity ] =  React.useState(shippingInfo ? shippingInfo.city : "");
    const [ phone,setPhone ] = React.useState(shippingInfo ? shippingInfo.phone : "");
    const [ postalCode,setPostalCode ] = React.useState(shippingInfo ? shippingInfo.postalCode : "");
    const [ country,setCountry ] = React.useState(shippingInfo ? shippingInfo.country : "");

    const dispatch = useDispatch(); 
    const navigate = useNavigate();

    const handleSaveShippings=(e)=>{
        e.preventDefault();
        dispatch(saveShippinInfo({
            address,
            city,
            phone,
            postalCode,
            country
        }))
        navigate("/order/confirm");
    }
  return (
    <React.Fragment>
        <MetaData title="Shipping Info" />
        <CheckOutSteps shipping/>
       <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={handleSaveShippings}>
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e)=>setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange={(e)=>setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phone}
                                onChange={(e)=>setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={postalCode}
                                onChange={(e)=>setPostalCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                onChange={(e)=>setCountry(e.target.value)}
                                required
                            >
                                {
                                    Object.values(countries).map(country=>(
                                        <option value={country.name} key={country.name}>
                                            {`${country.emoji}  ${country.name}`}
                                        </option>
                                    ))
                                }

                            </select>
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                            </button>
                    </form>
                </div>
            </div>
    </React.Fragment>
  )
}

export default Shipping