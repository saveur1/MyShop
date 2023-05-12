import React, { Fragment, useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { MDBDataTable } from "mdbreact"
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import MetaData from '../layout/MetaData';
import SideBar from './SideBar';
import Loader from '../layout/Loader';
import { getAllUsers,clearErrors, deleteUser } from '../../actions/userActions';
import { DELETE_USER_RESET } from '../../constants/userConstants';

const UsersList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users,error,loading } = useSelector(state => state.allUsers);
    const { isDeleted } = useSelector( state => state.user);

    useEffect(()=>{

        dispatch(getAllUsers());

        if(error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if(isDeleted) {
            navigate("/admin/users");
            toast.success("User is Deleted Successfully");
            dispatch({ type:DELETE_USER_RESET });
        }

    },[dispatch,error,isDeleted,navigate]);


    const feedDataTable =()=>{
        const data = {
            columns:[
             {
                label:"User ID",
                field:"id",
                sort:"asc"
             },
             {
                label:"Name",
                field:"name",
                sort:"asc"
             },
             {
                label:"Email",
                field:"email",
                sort:"asc"
             },
             {
                label:"Role",
                field:"role",
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
        users && users.forEach(user => {
            data.rows.push({
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                actions:<Fragment>
                            <Link to={`/admin/user/${user._id}`} className="btn btn-primary">
                                <i className="fa-solid fa-pencil"></i>
                            </Link>
                            <button type="button" className="btn btn-danger my-1 mx-2" onClick={()=>handleDeleteUser(user._id)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
            })
        });
        return data;
    }

    const handleDeleteUser = (id)=>{
        dispatch(deleteUser(id));
    }
  return (
    <Fragment>
    <MetaData title="All Users"/>
    <div className="row">
        <div className="col-12 col-md-2">
            <SideBar />
        </div>
        <div className="col-12 col-md-10">

            <h1 className="my-5">All Users</h1>
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

export default UsersList
