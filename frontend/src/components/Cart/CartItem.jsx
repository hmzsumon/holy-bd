import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { saveForLater } from '../../actions/saveForLaterAction';
import {
  addServiceToCart,
  removeItemsFromCart,
} from '../../actions/serviceCartAction';
import { getDeliveryDate } from '../../utils/functions';

const CartItem = ({
  service,
  name,
  price,
  image,
  desc,
  unit,
  quantity,
  inCart,
}) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const increaseQuantity = (id, quantity) => {
    const newQty = quantity + 1;
    dispatch(addServiceToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (quantity <= 1) return;
    dispatch(addServiceToCart(id, newQty));
  };

  const removeCartItem = (id) => {
    dispatch(removeItemsFromCart(id));
    enqueueSnackbar('Product Removed From Cart', { variant: 'success' });
  };

  const saveForLaterHandler = (id) => {
    dispatch(saveForLater(id));
    removeCartItem(id);
    enqueueSnackbar('Saved For Later', { variant: 'success' });
  };

  return (
    <div
      className='flex flex-col gap-3 py-5 pl-2 sm:pl-6 border-b overflow-hidden'
      key={service}
    >
      <Link
        to={`/product/${service}`}
        className='flex flex-col sm:flex-row gap-5 items-stretch w-full group'
      >
        {/* <!-- product image --> */}
        <div className='w-full sm:w-1/6 h-28 flex-shrink-0'>
          <img
            draggable='false'
            className='h-full w-full object-contain'
            src={image}
            alt={name}
          />
        </div>
        {/* <!-- product image --> */}

        {/* <!-- description --> */}
        <div className='flex flex-col sm:gap-5 w-full pr-6'>
          {/* <!-- product title --> */}
          <div className='flex flex-col sm:flex-row justify-between items-start pr-5 gap-1 sm:gap-0'>
            <div className='flex flex-col gap-0.5 sm:w-3/5'>
              <p className='group-hover:text-primary-blue'>
                {name.length > 42 ? `${name.substring(0, 42)}...` : name}{' '}
              </p>
              <span>
                1{unit} {price.toLocaleString()}৳
              </span>
              <span className='text-sm text-gray-500'>{desc}</span>
            </div>

            <div className='flex flex-col sm:gap-2'>
              <p className='text-sm'>Service Start at {getDeliveryDate()}</p>
            </div>
          </div>
          {/* <!-- product title --> */}

          {/* <!-- price desc --> */}
          <div className='flex items-baseline gap-2 text-xl font-medium'>
            <span>৳ {(price * quantity).toLocaleString()}</span>
          </div>
          {/* <!-- price desc --> */}
        </div>
        {/* <!-- description --> */}
      </Link>

      {/* <!-- save for later --> */}
      <div className='flex justify-between pr-4 sm:pr-0 sm:justify-start sm:gap-6'>
        {/* <!-- quantity --> */}
        <div className='flex gap-1 items-center'>
          <span
            onClick={() => decreaseQuantity(service, quantity)}
            className='w-7 h-7 text-3xl font-light bg-gray-50 rounded-full border flex items-center justify-center cursor-pointer'
          >
            <p>-</p>
          </span>
          <li
            className='w-auto list-none border outline-none text-center rounded-sm py-0.5 text-gray-700 font-medium text-sm qtyInput'
            disabled
          >
            {quantity} {unit}
          </li>
          <span
            onClick={() => increaseQuantity(service, quantity)}
            className='w-7 h-7 text-xl font-light bg-gray-50 rounded-full border flex items-center justify-center cursor-pointer'
          >
            +
          </span>
        </div>
        {/* <!-- quantity --> */}
        {inCart && (
          <>
            <button
              onClick={() => saveForLaterHandler(service)}
              className='sm:ml-4 disabled:cursor-not-allowed font-medium hover:text-primary-blue'
              disabled
            >
              SAVE FOR LATER
            </button>
            <button
              onClick={() => removeCartItem(service)}
              className='font-medium hover:text-red-600'
            >
              REMOVE
            </button>
          </>
        )}
      </div>
      {/* <!-- save for later --> */}
    </div>
  );
};

export default CartItem;