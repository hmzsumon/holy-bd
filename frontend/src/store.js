import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartReducer';
import {
  allOrdersReducer,
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderReducer,
  paymentStatusReducer,
} from './reducers/orderReducer';
import {
  newProductReducer,
  newReviewReducer,
  productDetailsReducer,
  productReducer,
  productReviewsReducer,
  productsReducer,
  reviewReducer,
} from './reducers/productReducer';
import { saveForLaterReducer } from './reducers/saveForLaterReducer';
import {
  allUsersReducer,
  forgotPasswordReducer,
  profileReducer,
  userDetailsReducer,
  userReducer,
} from './reducers/userReducer';
import { wishlistReducer } from './reducers/wishlistReducer';

import { serviceCartReducer } from './reducers/serviceCartReducer';
import {
  allServicesReducer,
  serviceCreateReducer,
  serviceDetailsReducer,
  serviceReducer,
} from './reducers/serviceReducer';

const reducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  products: productsReducer,
  productDetails: productDetailsReducer,
  newReview: newReviewReducer,
  cart: cartReducer,
  serviceCart: serviceCartReducer,
  saveForLater: saveForLaterReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  paymentStatus: paymentStatusReducer,
  orderDetails: orderDetailsReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  newProduct: newProductReducer,
  product: productReducer,
  users: allUsersReducer,
  userDetails: userDetailsReducer,
  reviews: productReviewsReducer,
  review: reviewReducer,
  wishlist: wishlistReducer,

  // new service
  newService: serviceCreateReducer,

  // get all services
  allServices: allServicesReducer,

  // get service details
  serviceDetails: serviceDetailsReducer,

  // service
  service: serviceReducer,
});

let initialState = {
  serviceCart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingInfo: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo'))
      : {},
  },
  saveForLater: {
    saveForLaterItems: localStorage.getItem('saveForLaterItems')
      ? JSON.parse(localStorage.getItem('saveForLaterItems'))
      : [],
  },
  wishlist: {
    wishlistItems: localStorage.getItem('wishlistItems')
      ? JSON.parse(localStorage.getItem('wishlistItems'))
      : [],
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
