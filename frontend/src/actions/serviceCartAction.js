import axios from 'axios';
import {
  ADD_TO_CART,
  EMPTY_CART,
  REMOVE_FROM_CART,
  SAVE_SHIPPING_INFO,
} from '../constants/serviceCartConstants';

// add to cart
export const addServiceToCart =
  (id, quantity = 1) =>
  async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/services/${id}`);

    dispatch({
      type: ADD_TO_CART,
      payload: {
        service: data.service.id,
        name: data.service.name,
        price: data.service.unitprice,
        image: data.service.icon_url,
        desc: data.service.description,
        unit: data.service.unit,
        icon_url: data.service.icon_url,
        total: data.service.unitprice * quantity,
        quantity,
      },
    });

    localStorage.setItem(
      'cartItems',
      JSON.stringify(getState().serviceCart.cartItems)
    );
  };

// remove cart item
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// empty cart
export const emptyCart = () => async (dispatch, getState) => {
  dispatch({ type: EMPTY_CART });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// save shipping info
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem('shippingInfo', JSON.stringify(data));
};
