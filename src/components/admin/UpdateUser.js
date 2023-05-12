import {Fragment,useState,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearErrors, getUserDetails, updateUser } from '../../actions/userActions';
import { UPDATE_USER_RESET } from '../../constants/userConstants';

import SideBar from './SideBar';
import MetaData from '../layout/MetaData';

const UpdateUser = () => {
    const [ name,setName ] = useState("");
    const [ email,setEmail ] = useState("");
    const [ role,setRole ] = useState("");

    const { user,error } = useSelector(state => state.userDetails);
    const { loading,error:updateError,isUpdated } = useSelector(state => state.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    useEffect(()=>{

        if(user && user._id !== params.id) {
            dispatch(getUserDetails(params.id));
        }else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }

        if(error){
            toast.error(error);
            dispatch(clearErrors());
        }

        if(updateError){
            toast.error(updateError);
            dispatch(clearErrors());
        }

        if(isUpdated) {
            navigate("/admin/users");
            toast.success("User Updated Successfully");
            dispatch({
                type:UPDATE_USER_RESET
            })
        }
    },[dispatch,error,navigate,updateError,isUpdated,params.id,user]);

    const submitHandler = (e)=>{
        e.preventDefault();
        const userData = new FormData();

        userData.set("name",name);
        userData.set("email",email);
        userData.set("role",role);

        dispatch(updateUser(params.id,userData));
    }
  return (
    <Fragment>
    <MetaData title={`Update User - ${params.id}`}/>
    <div className="row">
        <div className="col-12 col-md-2">
            <SideBar />
        </div>
        <div className="col-12 col-md-10">
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" method="POST" onSubmit={submitHandler}>
                        <h1 className="mt-2 mb-5">Update User</h1>

                        <div className="form-group">
                            <label fohtmlForr="name_field">Name</label>
                            <input 
								type="name" 
								id="name_field" 
								className="form-control"
                                name='name'
                                value={ name }
                                onChange={(e)=>setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={ email }
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                                    <label htmlFor="role_field">Role</label>

                                    <select
                                        id="role_field"
                                        className="form-control"
                                        name='role'
                                        value={ role }
                                        onChange={(e)=>setRole(e.target.value)}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>

                        <button 
                            type="submit" 
                            className="btn update-btn btn-block mt-4 mb-3" 
                            disabled={loading ? true : false }
                            >
                                { loading ? "Loading..." : "Update" }
                            </button>
                    </form>
                </div>
            </div>
        </div>
        </div>
        
    </Fragment>
  )
}

export default UpdateUser
