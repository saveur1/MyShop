import React,{useRef} from 'react';
import { useNavigate } from "react-router-dom";

const Search = () => {

    const navigate=useNavigate();

    const keyword = useRef("");

    const searchHandler=(event)=>{
        event.preventDefault();

        if(keyword.current.value.trim())
        {
            navigate(`/search/${keyword.current.value}`);
        }
        else
        {
            navigate("/");
        }
    }
  return (
    <form method="post" onSubmit={searchHandler}>
       <div className="input-group">
        <input
            type="text"
            id="search_field"
            className="form-control"
            placeholder="Enter Product Name ..."
            ref={keyword}
        />
        <div className="input-group-append">
            <button id="search_btn" className="btn">
            <i className="fa fa-search" aria-hidden="true"></i>
            </button>
        </div>
        </div>
    </form>
  )
}

export default Search
