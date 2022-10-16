import { TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, updateOrderItem } from '../../actions/orderAction';
import { UPDATE_ORDER_ITEM_RESET } from '../../constants/orderConstants';
import Loading from './Loading';

const UpdateOrderItems = ({ item }) => {
  const {
    loading,
    isUpdated,
    error: updateError,
  } = useSelector((state) => state.orderDetails);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { id, service_name, quantity, unit_price, icon_url, unit } = item;
  const [discount, setDiscount] = useState(0);

  const [total, setTotal] = useState(quantity * unit_price);
  const handleDiscountChange = (e) => {
    const discount = e.target.value;
    setDiscount(discount);
    setTotal(quantity * unit_price - discount);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('discount', discount);
    console.log(myForm);
    dispatch(updateOrderItem(id, discount));
  };

  useEffect(() => {
    if (updateError) {
      enqueueSnackbar(updateError, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (isUpdated) {
      enqueueSnackbar('Order Updates Successfully', { variant: 'success' });
      dispatch({ type: UPDATE_ORDER_ITEM_RESET });
    }
  }, [dispatch, updateError, isUpdated, enqueueSnackbar]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className='flex p-4 items-start bg-white border rounded gap-2 sm:gap-0 hover:shadow-lg'>
          {/* <!-- image container --> */}
          <div className='w-full sm:w-32 h-20'>
            <img
              draggable='false'
              className='h-full w-full object-contain'
              src={icon_url}
              alt={service_name}
            />
          </div>
          {/* <!-- image container --> */}

          {/* <!-- order desc container --> */}
          <div className='flex flex-col sm:flex-row justify-between w-full'>
            <div className='flex flex-col gap-1 overflow-hidden'>
              <p className='text-sm'>{service_name}</p>
              <p className='text-xs text-gray-500 mt-2'>Quantity: {quantity}</p>
              <p className='text-xs text-gray-500'>
                Total: ৳ {total.toLocaleString()}
              </p>
            </div>

            <div className='flex flex-col sm:flex-row mt-1 sm:mt-0 gap-2 sm:gap-20 sm:w-1/2'>
              <p className='text-sm'>
                {' '}
                1 {unit} {unit_price?.toLocaleString()} ৳
              </p>

              <div className='flex flex-col gap-1.5'>
                <TextField
                  label='Discount'
                  variant='outlined'
                  size='small'
                  required
                  type='number'
                  value={discount}
                  onChange={handleDiscountChange}
                />
                <button
                  onClick={submitHandler}
                  className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          {/* <!-- order desc container --> */}
        </div>
      )}
    </>
  );
};

export default UpdateOrderItems;
