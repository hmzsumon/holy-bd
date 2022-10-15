import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  clearErrors,
  deleteService,
  getAllServices,
} from '../../actions/serviceAction';
import { DELETE_SERVICE_RESET } from '../../constants/serviceConstants';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import Actions from './Actions';

const ServiceTable = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { services, error } = useSelector((state) => state.allServices);
  const {
    loading,
    isDeleted,
    error: deleteError,
  } = useSelector((state) => state.service);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (deleteError) {
      enqueueSnackbar(deleteError, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (isDeleted) {
      enqueueSnackbar('Service Deleted Successfully', { variant: 'success' });
      dispatch({ type: DELETE_SERVICE_RESET });
    }
    dispatch(getAllServices());
  }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

  const deleteProductHandler = (id) => {
    dispatch(deleteService(id));
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 50,
      flex: 0.1,
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 rounded-full'>
              <img
                draggable='false'
                src={params.row.image}
                alt={params.row.name}
                className='w-full h-full rounded-full object-cover'
              />
            </div>
            {params.row.name}
          </div>
        );
      },
    },

    {
      field: 'unit',
      headerName: 'Unit',
      minWidth: 200,
      flex: 1,
    },

    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      minWidth: 100,
      headerAlign: 'left',
      align: 'left',
      flex: 0.2,
      renderCell: (params) => {
        return <span>৳{params.row.price?.toLocaleString()}</span>;
      },
    },

    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 100,
      flex: 0.3,
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <Actions
            editRoute={'service'}
            deleteHandler={deleteProductHandler}
            id={params.row.id}
          />
        );
      },
    },
  ];

  const rows = [];

  services &&
    services.forEach((item) => {
      rows.unshift({
        id: item.id,
        name: item.name,
        image: item.icon_url,
        price: item.unitprice,
        unit: item.unit,
      });
    });

  return (
    <>
      <MetaData title='Admin Services | Holy' />

      {loading && <BackdropLoader />}

      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-medium uppercase'> services</h1>
        <Link
          to='/admin/new_service'
          className='py-2 px-4 rounded shadow font-medium text-white bg-primary-blue hover:shadow-lg'
        >
          New Service
        </Link>
      </div>
      <div
        className='bg-white rounded-xl shadow-lg w-full'
        style={{ height: 470 }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectIconOnClick
          sx={{
            boxShadow: 0,
            border: 0,
          }}
        />
      </div>
    </>
  );
};

export default ServiceTable;
