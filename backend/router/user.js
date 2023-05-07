const express = require('express');
const router = express.Router();

// Import the controllers (userController.js) to use its database functions.
const { 
    registerUser, 
    loginUser, 
    logoutUser,
    userForgotPassword, 
    userResetPassword, 
    getUserProfile, 
    updateUserPassword, 
    updateUserProfile,
    getAllUsers,
    getUserDetails,
    updateUserInfo,
    deleteUser
} = require("../controllers/userController.js");

const { CheckAuth, CheckRole } = require('../middlewares/CheckAuth.js');

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(userForgotPassword);
router.route("/password/reset/:token").put(userResetPassword);

router.route("/logout").get(logoutUser);

router.route("/profile").get(CheckAuth,getUserProfile);
router.route("/profile/update").put(CheckAuth,updateUserProfile);
router.route("/password/update").put(CheckAuth, updateUserPassword);

router.route("/admin/users").get(CheckAuth,CheckRole("admin"),getAllUsers);
router.route("/admin/user/:id").get(CheckAuth,CheckRole("admin"),getUserDetails)
                               .put(CheckAuth,CheckRole("admin"),updateUserInfo)
                               .delete(CheckAuth,CheckRole("admin"),deleteUser);


module.exports = router;