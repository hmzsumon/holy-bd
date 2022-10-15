import ImageIcon from '@mui/icons-material/Image';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearErrors } from '../../actions/productAction';
import { newService } from '../../actions/serviceAction';
import { SERVICE_CREATE_RESET } from '../../constants/serviceConstants';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';

const NewService = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector((state) => state.newService);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);

  const [icon, setIcon] = useState('');
  const [iconPreview, setIconPreview] = useState('');

  const handleIconChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setIconPreview(reader.result);
        setIcon(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const newProductSubmitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.set('name', name);
    formData.set('description', description);
    formData.set('unit', unit);
    formData.set('unitPrice', unitPrice);
    formData.set('icon', icon);

    dispatch(newService(formData));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar('Product Created', { variant: 'success' });
      dispatch({ type: SERVICE_CREATE_RESET });
      navigate('/admin/services');
    }
  }, [dispatch, error, success, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title='Admin: New Product | Holy Treders' />

      {loading && <BackdropLoader />}
      <form
        onSubmit={newProductSubmitHandler}
        encType='multipart/form-data'
        className='flex flex-col sm:flex-row bg-white rounded-lg shadow p-4'
        id='mainform'
      >
        <div className='flex flex-col gap-3 m-2 sm:w-1/2'>
          <TextField
            label='Name'
            variant='outlined'
            size='small'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label='Description'
            multiline
            rows={3}
            required
            variant='outlined'
            size='small'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className='flex justify-between'>
            <TextField
              label='Unit'
              variant='outlined'
              size='small'
              required
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />

            <TextField
              label='Unit Price'
              type='number'
              variant='outlined'
              size='small'
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
              required
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>
        </div>

        <div className='flex flex-col gap-2 m-2 sm:w-1/2'>
          <h2 className='font-medium'>Service Images</h2>
          <div className='flex gap-2 overflow-x-auto h-32 border rounded'>
            <div className='w-1/2 h-full md:w-full  flex items-center justify-center border rounded-lg'>
              {!iconPreview ? (
                <ImageIcon fontSize='large' />
              ) : (
                <img
                  draggable='false'
                  src={iconPreview}
                  alt='Brand Logo'
                  className='w-full h-full object-contain'
                />
              )}
            </div>
          </div>
          <label className='rounded font-medium bg-gray-400 text-center cursor-pointer text-white p-2 shadow hover:shadow-lg my-2'>
            <input
              type='file'
              name='images'
              accept='image/*'
              multiple
              onChange={handleIconChange}
              className='hidden'
            />
            Choose Files
          </label>

          <div className='flex justify-end'>
            <input
              form='mainform'
              type='submit'
              className='bg-primary-orange uppercase w-1/3 p-3 text-white font-medium rounded shadow hover:shadow-lg cursor-pointer'
              value='Submit'
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default NewService;
