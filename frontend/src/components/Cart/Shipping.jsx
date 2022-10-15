import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Country, State } from 'country-state-city';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../../actions/cartAction';
import MetaData from '../Layouts/MetaData';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { enqueueSnackbar } = useSnackbar();

  const { cartItems } = useSelector((state) => state.serviceCart);
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [country, setCountry] = useState(shippingInfo.country);
  const [state, setState] = useState(shippingInfo.state);
  const [zip, setZip] = useState(shippingInfo.zip);
  const [phone, setPhone] = useState(shippingInfo.phone);

  const shippingSubmit = (e) => {
    e.preventDefault();

    dispatch(saveShippingInfo({ address, city, country, state, zip, phone }));
    navigate('/order/confirm');
  };

  return (
    <>
      <MetaData title='Holy Tradres: Shipping Details' />
      <main className='w-full mt-20'>
        {/* <!-- row --> */}
        <div className='flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7 overflow-hidden'>
          {/* <!-- cart column --> */}
          <div className='flex-1'>
            <Stepper activeStep={1}>
              <div className='w-full bg-white'>
                <form
                  onSubmit={shippingSubmit}
                  autoComplete='off'
                  className='flex flex-col justify-start gap-3 w-full sm:w-3/4 mx-1 sm:mx-8 my-4'
                >
                  <TextField
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fullWidth
                    label='Address'
                    variant='outlined'
                    required
                  />

                  <div className='flex gap-6'>
                    <TextField
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      type='number'
                      label='Pincode'
                      fullWidth
                      variant='outlined'
                      required
                    />
                    <TextField
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type='number'
                      label='Phone No'
                      fullWidth
                      variant='outlined'
                      required
                    />
                  </div>

                  <div className='flex gap-6'>
                    <TextField
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      label='City'
                      fullWidth
                      variant='outlined'
                      required
                    />
                    <TextField
                      label='Landmark (Optional)'
                      fullWidth
                      variant='outlined'
                    />
                  </div>

                  <div className='flex gap-6'>
                    <FormControl fullWidth>
                      <InputLabel id='country-select'>Country</InputLabel>
                      <Select
                        labelId='country-select'
                        id='country-select'
                        defaultValue={country}
                        label='Country'
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        {Country.getAllCountries().map((country) => (
                          <MenuItem
                            key={country.isoCode}
                            value={country.isoCode}
                          >
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {country && (
                      <FormControl fullWidth disabled={country ? false : true}>
                        <InputLabel id='state-select'>State</InputLabel>
                        <Select
                          labelId='state-select'
                          id='state-select'
                          value={state}
                          label='State'
                          onChange={(e) => setState(e.target.value)}
                          required
                        >
                          {State.getStatesOfCountry(country).map((state) => (
                            <MenuItem key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </div>

                  <button
                    type='submit'
                    className='bg-primary-orange w-full sm:w-1/3 my-2 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none'
                  >
                    save and deliver here
                  </button>
                </form>
              </div>
            </Stepper>
          </div>

          <PriceSidebar cartItems={cartItems} />
        </div>
      </main>
    </>
  );
};

export default Shipping;
