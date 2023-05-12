import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { isAuthenticated,loading} = useSelector(state=>state.auth);

  return (
    <Fragment>
      {
          loading===false && <Fragment>
                                {
                                    isAuthenticated ? <Outlet /> : <Navigate to="/login" />
                                }
                            </Fragment>
                         

      }
    </Fragment>
  )
}

export default PrivateRoute
