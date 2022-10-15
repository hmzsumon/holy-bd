import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServices } from '../../../actions/serviceAction';
import Loader from '../../Layouts/Loader';
import Service from './Service';

const Services = () => {
  const dispatch = useDispatch();

  const { services, loading } = useSelector((state) => state.allServices);

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);
  return (
    <div className='py-10'>
      <h1 className='text-3xl text-center font-bold text-gray-800'>
        Our Services
      </h1>
      {loading ? (
        <Loader />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 px-8 md:px-20 my-20'>
          {services &&
            services.map((service) => (
              <Service key={service.id} service={service} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Services;
