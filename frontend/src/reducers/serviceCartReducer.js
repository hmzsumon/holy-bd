import {
  ADD_TO_CART,
  EMPTY_CART,
  REMOVE_FROM_CART,
  SAVE_SHIPPING_INFO,
} from '../constants/serviceCartConstants';

export const serviceCartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  { type, payload }
) => {
  switch (type) {
    case ADD_TO_CART:
      const item = payload;
      const isItemExist = state.cartItems.find(
        (el) => el.service === item.service
      );

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((el) =>
            el.service === isItemExist.service ? item : el
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((el) => el.service !== payload),
      };
    case EMPTY_CART:
      return {
        ...state,
        cartItems: [],
      };
    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: payload,
      };
    default:
      return state;
  }
};
