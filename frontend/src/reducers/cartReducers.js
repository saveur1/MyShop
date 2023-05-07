import { ADD_TO_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO } from "../constants/cartConstants";

export const cartReducer = (state={cartItems:[],shippingInfo:{}},action)=>{
    switch(action.type){
        case ADD_TO_CART:
            const item = action.payload;

            const isExist = state.cartItems.find(prod=>prod.product===item.product);

            if(isExist)
            {
                return {
                    ...state,
                    cartItems:state.cartItems.map(prod=>prod.product===isExist.product ? item : prod)
                }
            }
            else 
            {
                return {
                    ...state,
                    cartItems:[...state.cartItems,item]
                }
            }
        case REMOVE_FROM_CART:
            return {
                cartItems:state.cartItems.filter(item =>item.product !== action.payload)
            }

        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo:action.payload
            }
        default:
            return state;
    }
}