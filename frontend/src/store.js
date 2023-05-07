import { combineReducers,legacy_createStore as createStore,applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productReviewReducer, productsReducer, reviewReducer } from "./reducers/productReducers";
import { allUsersReducer, forgotPasswordReducer, loginReducer, userDetailsReducer, userReducer } from "./reducers/userReducers";
import { cartReducer } from "./reducers/cartReducers";
import { allOrdersReducer, newOrderReducer,orderDetailsReducer,ordersReducer, updateOrderReducer } from "./reducers/orderReducers";

const reducers = combineReducers({
   products:productsReducer,
   newProduct:newProductReducer,
   productDetails:productDetailsReducer,
   product:productReducer,
   auth:loginReducer,
   user:userReducer,
   userDetails:userDetailsReducer,
   allUsers:allUsersReducer,
   forgotPassword:forgotPasswordReducer,
   cart:cartReducer,
   orders:newOrderReducer,
   myOrders:ordersReducer,
   orderDetails:orderDetailsReducer,
   allOrders:allOrdersReducer,
   order:updateOrderReducer,
   newReview:newReviewReducer,
   productReviews:productReviewReducer,
   review:reviewReducer
});

const initialStates={
   cart:{
      cartItems:localStorage.getItem("cartItems") 
                ? JSON.parse(localStorage.getItem("cartItems"))
                : [],
      shippingInfo:localStorage.getItem("shippingInfo") 
                ? JSON.parse(localStorage.getItem("shippingInfo"))
                : {}
   }
};

const middleware = [thunk];

const store = createStore(reducers,initialStates,composeWithDevTools(applyMiddleware(...middleware)));

export default store;