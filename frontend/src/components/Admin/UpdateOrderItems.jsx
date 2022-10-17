import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const UpdateOrderItems = ({ item }) => {
  const navigate = useNavigate();
  const {
    id,
    service_name,
    total,
    discount,
    quantity,
    unit_price,
    icon_url,
    unit,
  } = item;

  const handleEdit = () => {
    console.log('edit');

    navigate(`/admin/order/${id}/edit`);
  };

  return (
    <>
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
              <button className=' w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
                Discount: {discount} ৳
              </button>

              <NavLink
                to={`/admin/order/item/${id}`}
                className='bg-transparent text-center hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
              >
                Edit
              </NavLink>
            </div>
          </div>
        </div>
        {/* <!-- order desc container --> */}
      </div>
    </>
  );
};

export default UpdateOrderItems;
