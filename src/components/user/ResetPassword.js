import React from 'react'
import { useNavigate,useParams } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearErrors } from '../../actions/userActions';
import { resetPassword } from '../../actions/userActions';

const ResetPassword = () => {
    const [ password,setPassword] = React.useState("");
    const [ confirmPassword,setConfirmPassword] = React.useState("");

    const { error,success,loading } = useSelector(state =>state.forgotPassword);
    const { token } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(()=>{

        if(error){
            toast.error(error);
            dispatch(clearErrors());
        }
        if(success){
            toast.success("Password is Reseted Successfully");
            navigate("/login");
        }
    },[error,dispatch,success,navigate]);

    const handleResetPassword=(e)=>{
        e.preventDefault();

        const formData = new FormData();

        formData.set("password",password);
        formData.set("confirmPassword",confirmPassword);

        dispatch(resetPassword(token,formData));
    }
  return (
    <React.Fragment>
      <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" method="POST" onSubmit={handleResetPassword}>
                    <h1 className="mb-3">New Password</h1>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="new_password_button"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled={loading ? true:false}>
                        {loading ? "Loading..." : "Set Password"}
                    </button>

                </form>
            </div>
        </div>
    </React.Fragment>
  )
}

export default ResetPassword
