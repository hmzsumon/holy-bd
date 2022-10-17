import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  clearErrors,
  getOrderDetails,
  updateOrder,
} from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import { formatDate } from '../../utils/functions';
import MetaData from '../Layouts/MetaData';
import TrackStepper from '../Order/TrackStepper';
import Loading from './Loading';
import UpdateOrderItems from './UpdateOrderItems';

const UpdateOrder = () => {
  const { order, error, loading, orderItems } = useSelector(
    (state) => state.orderDetails
  );
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const [status, setStatus] = useState('');

  const { isUpdated, error: updateError } = useSelector((state) => state.order);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (updateError) {
      enqueueSnackbar(updateError, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (isUpdated) {
      enqueueSnackbar('Order Updates Successfully', { variant: 'success' });
      dispatch({ type: UPDATE_ORDER_RESET });
    }
    dispatch(getOrderDetails(params.id));
  }, [dispatch, error, params.id, isUpdated, updateError, enqueueSnackbar]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('status', status);
    dispatch(updateOrder(params.id, formData));
  };

  return (
    <>
      <MetaData title='Admin: Update Order | Holy Tradres' />

      {loading ? (
        <Loading />
      ) : (
        <>
          {order && (
            <div className='flex flex-col gap-4'>
              <Link
                to='/admin/orders'
                className='ml-1 flex items-center gap-0 font-medium text-primary-blue uppercase'
              >
                <ArrowBackIosIcon sx={{ fontSize: '18px' }} />
                Go Back
              </Link>

              <div className='flex flex-col  bg-white shadow-lg rounded-lg min-w-full'>
                <div className='w-full'>
                  <div className='flex flex-col gap-3 my-8 mx-10'>
                    <h3 className='font-medium text-lg'>Delivery Address</h3>
                    <h4 className='font-medium'>{order.username}</h4>
                    <p className='text-sm'>{`${order.address}, ${order.city}, ${order.order_status} - ${order.zip}`}</p>
                    {/* <div className='flex gap-2 text-sm'>
                      <p className='font-medium'>Email</p>
                      <p>{order.user.email}</p>
                    </div> */}
                    <div className='flex gap-2 text-sm'>
                      <p className='font-medium'>Phone Number</p>
                      <p>{order.phone}</p>
                    </div>
                    <div className='flex gap-2 text-sm'>
                      <p className='font-medium'>Total Amount:</p>
                      <p>{order.total} ৳</p>
                    </div>
                    <div className='flex gap-2 text-sm'>
                      <p className='font-medium'>Total Discount:</p>
                      <p>{order.discount} ৳</p>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-3 p-8'>
                  {/* Service Items */}
                  {orderItems &&
                    orderItems.map((item) => {
                      return (
                        <div key={item.id}>
                          <UpdateOrderItems item={item} />
                        </div>
                      );
                    })}
                  {/* Update Status */}
                  <h3 className='font-medium text-lg'>Update Status</h3>
                  <form onSubmit={updateOrderSubmitHandler}>
                    <div className='flex gap-2'>
                      <p className='text-sm font-medium'>Current Status:</p>
                      <p className='text-sm'>
                        {order.order_status === 'Shipped' &&
                          `Shipped on ${formatDate(order.shipped_at)}`}
                        {order.order_status === 'Processing' &&
                          `Ordered on ${formatDate(order.created_at)}`}
                        {order.order_status === 'Delivered' &&
                          `Delivered on ${formatDate(order.delivered_at)}`}
                      </p>
                    </div>
                    <div>
                      <FormControl fullWidth sx={{ marginTop: 1 }}>
                        <InputLabel id='order-status-select-label'>
                          Status
                        </InputLabel>
                        <Select
                          labelId='order-status-select-label'
                          id='order-status-select'
                          value={status}
                          label='Status'
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          {order.order_status === 'Shipped' && (
                            <MenuItem value={'Delivered'}>Delivered</MenuItem>
                          )}
                          {order.order_status === 'processing' && (
                            <MenuItem value={'Shipped'}>Shipped</MenuItem>
                          )}
                          {order.order_status === 'Delivered' && (
                            <MenuItem value={'Delivered'}>Delivered</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                      <div className='flex flex-col my-4 mx-auto w-full sm:w-1/2'>
                        <h3 className='font-medium sm:text-center'>
                          Order Status
                        </h3>
                        <TrackStepper
                          orderOn={order.created_at}
                          shippedAt={order.shipped_at}
                          deliveredAt={order.delivered_at}
                          activeStep={
                            order.order_status === 'processing'
                              ? 2
                              : order.order_status === 'Shipped'
                              ? 1
                              : 0
                          }
                        />
                      </div>
                      <button className=' w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
                        Update Status
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UpdateOrder;
