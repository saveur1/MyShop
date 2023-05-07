import React, { Fragment,useState,useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { registerUser } from '../../actions/userActions';
import { toast } from 'react-toastify';
import { clearErrors } from '../../actions/userActions';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';

const Register = () => {

    const [user,setUser]=useState({
        name:"",
        email:"",
        password:""
    });

    const { name,email,password} = user;
    const [avatar,setAvatar] = useState();
    const [avatarPreview,setAvatarPreview]=useState("/images/avatar.jpeg")
    
    const dispatch =useDispatch();
    const navigate=useNavigate();

    const {error,isAuthenticated,loading}=useSelector((state)=>state.auth);

    useEffect(()=>{
        if(isAuthenticated){
            navigate("/");
        }
        if(error){
            toast.error(error);
            dispatch(clearErrors());
        }
    },[dispatch,error,isAuthenticated,navigate])

    const handleRegister=(e)=>{
        e.preventDefault();

        const formData = new FormData();
        formData.set("name",name);
        formData.set("email",email);
        formData.set("password",password);
        formData.set("avatar",avatar);
        dispatch(registerUser(formData));
    }

    const onChange = (e)=>{
        if(e.target.name==="avatar"){
            const reader = new FileReader()

            reader.onload=()=>{
                if(reader.readyState===2){
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            }

            reader.readAsDataURL(e.target.files[0]);
        }
        else
        {
            setUser({...user,[e.target.name]:e.target.value});
        }
    }
  return (
    <Fragment>
        <MetaData title="Register"/>
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={handleRegister} encType='multipart/form-data'>
                <h1 className="mb-3">Register</h1>

            <div className="form-group">
                <label htmlFor="email_field">Name</label>
                <input 
                    type="name" 
                    id="name_field" 
                    className="form-control" 
                    value={name}
                    name="name"
                    onChange={onChange}
                    />
            </div>

                <div className="form-group">
                <label htmlFor="email_field">Email</label>
                <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    value={email}
                    name="email"
                    onChange={onChange}
                />
                </div>
    
                <div className="form-group">
                <label htmlFor="password_field">Password</label>
                <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    value={password}
                    name="password"
                    onChange={onChange}
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
                                alt='Avatar preview'
                            />
                        </figure>
                    </div>
                    <div className='custom-file'>
                        <input
                            type='file'
                            name='avatar'
                            className='custom-file-input'
                            id='customFile'
                            accept="images/*"
                            onChange={onChange}
                        />
                        <label className='custom-file-label' htmlFor='customFile'>
                            Choose Avatar
                        </label>
                    </div>
                </div>
            </div>
    
                <button
                id="register_button"
                type="submit"
                className="btn btn-block py-3"
                disabled={loading ?  true : false}
                >
                {loading ? "Loading..." :"REGISTER"}
                </button>
            </form>
            </div>
        </div>
    </Fragment>
  )
}

export default Register;
