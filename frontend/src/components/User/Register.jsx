import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearErrors, registerUser } from '../../actions/userAction';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import FormSidebar from './FormSidebar';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const [user, setUser] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    cpassword: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',

    gender: '',
  });

  const {
    username,
    name,
    email,
    phone,
    password,
    cpassword,
    address,
    city,
    state,
    country,
    zip,
    gender,
  } = user;

  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState('preview.png');

  const handleRegister = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      enqueueSnackbar('Password length must be atleast 6 characters', {
        variant: 'warning',
      });
      return;
    }
    if (password !== cpassword) {
      enqueueSnackbar("Password Doesn't Match", { variant: 'error' });
      return;
    }
    if (!avatar) {
      enqueueSnackbar('Select Avatar', { variant: 'error' });
      return;
    }

    const formData = new FormData();
    formData.set('username', username);
    formData.set('name', name);
    formData.set('email', email);
    formData.set('phone', phone);
    formData.set('password', password);
    formData.set('address', address);
    formData.set('city', city);
    formData.set('state', state);
    formData.set('country', country);
    formData.set('zip', zip);
    formData.set('gender', gender);

    formData.set('avatar', avatar);

    dispatch(registerUser(formData));
  };

  const handleDataChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate('/');
    }
  }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title='Register | Holy Tradres' />

      {loading && <BackdropLoader />}
      <main className='w-full mt-12 sm:pt-20 sm:mt-0'>
        {/* <!-- row --> */}
        <div className='flex sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg'>
          <FormSidebar
            title="Looks like you're new here!"
            tag='Sign up with your mobile number to get started'
          />

          {/* <!-- signup column --> */}
          <div className='flex-1 overflow-hidden'>
            {/* <!-- personal info procedure container --> */}
            <form
              onSubmit={handleRegister}
              encType='multipart/form-data'
              className='p-5'
            >
              <h1 className='text-3xl text-center my-4 text-gray-800'>
                Create your account{' '}
              </h1>
              <div className='flex flex-col gap-4 items-start'>
                {/* <!-- input container column --> */}
                <div className='flex flex-col w-full justify-between sm:flex-col gap-3 items-center'>
                  <TextField
                    label='Username'
                    variant='outlined'
                    name='username'
                    value={username}
                    onChange={handleDataChange}
                    fullWidth
                    required
                  />

                  <TextField
                    label='Name'
                    variant='outlined'
                    name='name'
                    value={name}
                    onChange={handleDataChange}
                    fullWidth
                    required
                  />

                  <TextField
                    label='Email'
                    variant='outlined'
                    name='email'
                    value={email}
                    onChange={handleDataChange}
                    fullWidth
                    required
                  />

                  <TextField
                    label='Phone'
                    variant='outlined'
                    name='phone'
                    value={phone}
                    onChange={handleDataChange}
                    fullWidth
                    required
                  />

                  <TextField
                    label='Address'
                    variant='outlined'
                    name='address'
                    value={address}
                    onChange={handleDataChange}
                    fullWidth
                    required
                  />

                  <div className='flex flex-col w-full justify-between sm:flex-row gap-3 items-center'>
                    <TextField
                      label='City'
                      variant='outlined'
                      name='city'
                      value={city}
                      onChange={handleDataChange}
                      fullWidth
                      required
                    />

                    <TextField
                      label='State'
                      variant='outlined'
                      name='state'
                      value={state}
                      onChange={handleDataChange}
                      fullWidth
                      required
                    />
                  </div>

                  <div className='flex flex-col w-full justify-between sm:flex-row gap-3 items-center'>
                    <TextField
                      label='Country'
                      variant='outlined'
                      name='country'
                      value={country}
                      onChange={handleDataChange}
                      fullWidth
                      required
                    />

                    <TextField
                      label='Zip'
                      variant='outlined'
                      name='zip'
                      value={zip}
                      onChange={handleDataChange}
                      fullWidth
                      required
                    />
                  </div>
                </div>
                {/* <!-- input container column --> */}

                {/* <!-- input container column --> */}
                <div className='flex flex-col w-full justify-between sm:flex-row gap-3 items-center'>
                  <TextField
                    id='password'
                    label='Password'
                    type='password'
                    name='password'
                    value={password}
                    onChange={handleDataChange}
                    required
                    fullWidth
                  />
                  <TextField
                    id='confirm-password'
                    label='Confirm Password'
                    type='password'
                    name='cpassword'
                    value={cpassword}
                    onChange={handleDataChange}
                    required
                    fullWidth
                  />
                </div>
                {/* <!-- input container column --> */}

                {/* <!-- gender input --> */}
                <div className='flex gap-4 items-center'>
                  <h2 className='text-md'>Your Gender :</h2>
                  <div className='flex items-center gap-6' id='radioInput'>
                    <RadioGroup
                      row
                      aria-labelledby='radio-buttons-group-label'
                      name='radio-buttons-group'
                    >
                      <FormControlLabel
                        name='gender'
                        value='male'
                        onChange={handleDataChange}
                        control={<Radio required />}
                        label='Male'
                      />
                      <FormControlLabel
                        name='gender'
                        value='female'
                        onChange={handleDataChange}
                        control={<Radio required />}
                        label='Female'
                      />
                    </RadioGroup>
                  </div>
                </div>
                {/* <!-- gender input --> */}

                <div className='flex flex-col w-full justify-between sm:flex-row gap-3 items-center'>
                  <Avatar
                    alt='Avatar Preview'
                    src={avatarPreview}
                    sx={{ width: 56, height: 56 }}
                  />
                  <label className='rounded font-medium bg-gray-400 text-center cursor-pointer text-white w-full py-2 px-2.5 shadow hover:shadow-lg'>
                    <input
                      type='file'
                      name='avatar'
                      accept='image/*'
                      onChange={handleDataChange}
                      className='hidden'
                    />
                    Choose File
                  </label>
                </div>
                <button
                  type='submit'
                  className='text-white py-3 w-full bg-primary-orange shadow hover:shadow-lg rounded-sm font-medium'
                >
                  Signup
                </button>
                <Link
                  to='/login'
                  className='hover:bg-gray-50 text-primary-blue text-center py-3 w-full shadow border rounded-sm font-medium'
                >
                  Existing User? Log in
                </Link>
              </div>
            </form>
            {/* <!-- personal info procedure container --> */}
          </div>
          {/* <!-- signup column --> */}
        </div>
        {/* <!-- row --> */}
      </main>
    </>
  );
};

export default Register;
