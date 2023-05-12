import React from 'react'
import { forgotPassword } from '../../actions/userActions';
import { useDispatch,useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { clearErrors } from '../../actions/userActions';
 
const ForgotPassword = () => {
    const [ email,setEmail] = React.useState("");

    const { error,message,loading } = useSelector(state =>state.forgotPassword);

    const dispatch = useDispatch();

    React.useEffect(()=>{

        if(error){
            toast.error(error);
            dispatch(clearErrors());
        }
        if(message){
            toast.success(message);
        }
    },[error,dispatch,message]);

    const handleForgotPassword=(e)=>{
        e.preventDefault();

        const formData = new FormData();

        formData.set("email",email);

        dispatch(forgotPassword(formData));
    }
  return (
    <React.Fragment>
        <div className="row wrapper mt-5">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={handleForgotPassword}>
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label for="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true:false}
                            >
                            {loading? "Loading...":"Send Email"}
                    </button>

                    </form>
                </div>
            </div>
    </React.Fragment>
  )
}

export default ForgotPassword
