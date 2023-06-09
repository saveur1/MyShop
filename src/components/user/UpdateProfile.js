import React,{ Fragment,useState,useEffect} from 'react';
import { useSelector,useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearErrors, loadUserProfile, updateProfile } from '../../actions/userActions';
import { useNavigate } from "react-router-dom";
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';

import MetaData from "../layout/MetaData";

const UpdateProfile = () => {

    const [ name,setName] = useState("");
    const [ email,setEmail]=useState("");
    const [ avatar,setAvatar] = useState("");
    const [ avatarPreview,setAvatarPreview] = useState("/images/avatar.jpeg");

    const { user } = useSelector(state =>state.auth);
    const { error,isUpdated,loading } = useSelector(state =>state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{

        if(user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
        if(error){
            toast.error(error);
            dispatch(clearErrors());
        }
        if(isUpdated){
            toast.success("User updated successfully");
            dispatch(loadUserProfile());

            navigate("/profile");

            dispatch({
                type:UPDATE_PROFILE_RESET
            });
        }
    },[error,user,dispatch,isUpdated,navigate]);

    const handleUpdateProfile=(e)=>{
        e.preventDefault();

        const formData = new FormData();

        formData.set("name",name);
        formData.set("email",email);
        formData.set("avatar",avatar);

        dispatch(updateProfile(formData));
    }

    const handleUploadImage=(e)=>{

        const reader = new FileReader();

        reader.onload = ()=>{
            if(reader.readyState===2){
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    }
  return (
    <Fragment>
       <MetaData title="Update Profile"/>
       <div className="row wrapper mt-5">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={handleUpdateProfile} encType='multipart/form-data'>
                        <h1 className="mt-2 mb-5">Update Profile</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input 
								type="name" 
								id="name_field" 
								className="form-control"
                                name='name'
                                value={name}
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
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept="image/*"
                                        onChange={handleUploadImage}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                </label>
                                </div>
                            </div>
                        </div>

                        <button 
                           type="submit" 
                           className="btn update-btn btn-block mt-4 mb-3"
                           disabled={loading ? true : false } 
                           >
                            {loading ? "Loading..." : "Update"}
                        </button>
                    </form>
                </div>
            </div>
    </Fragment>
  )
}

export default UpdateProfile
