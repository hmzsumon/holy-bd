import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addServiceToCart } from '../../../actions/serviceCartAction';

const Service = ({ service }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { name, icon_url, description, unit, unitprice } = service;
  const { cartItems } = useSelector((state) => state.serviceCart);

  const addToCartHandler = () => {
    dispatch(addServiceToCart(service.id));
    enqueueSnackbar('Service Added To Cart', { variant: 'success' });
  };
  const itemInCart = cartItems.some((item) => item.service === service.id);

  const goToCart = () => {
    navigate('/service/cart');
  };
  return (
    <div className='bg-gray-200 py-10 px-6 space-y-4'>
      <div className='w-44 h-48 mx-auto'>
        <img
          draggable='false'
          className='w-full h-full object-contain'
          src={icon_url}
          alt=''
        />
      </div>
      <h2 className='text-primary-orange text-center text-2xl font-bold'>
        {name}
      </h2>

      <p className='text-gray-800 text-center text-sm  '>{description}</p>
      <div className='flex items-center justify-between'>
        <p>Unit: {unit} </p>
        <p>Unit Price: {unitprice} </p>
      </div>
      <button
        onClick={itemInCart ? goToCart : addToCartHandler}
        className='p-4 w-full flex items-center justify-center gap-2 text-white bg-primary-yellow rounded-sm shadow hover:shadow-lg'
      >
        <ShoppingCartIcon />
        {itemInCart ? 'GO TO CART' : 'ADD TO CART'}
      </button>
    </div>
  );
};

export default Service;
