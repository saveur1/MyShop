import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivate = () => {
  const { isAuthenticated,loading,user} = useSelector(state=>state.auth);

  return (
    <Fragment>
      {
          loading===false && <Fragment>
                                {
                                    isAuthenticated && user.role==="admin" ? <Outlet /> : <Navigate to="/" />
                                }
                            </Fragment>
                         

      }
    </Fragment>
  )
}

export default AdminPrivate
