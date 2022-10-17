import axios from 'axios';
import {
  ALL_SERVICES_FAIL,
  ALL_SERVICES_REQUEST,
  ALL_SERVICES_SUCCESS,
  CLEAR_ERRORS,
  DELETE_SERVICE_FAIL,
  DELETE_SERVICE_REQUEST,
  DELETE_SERVICE_SUCCESS,
  GET_SERVICE_ITEM_FAIL,
  GET_SERVICE_ITEM_REQUEST,
  GET_SERVICE_ITEM_SUCCESS,
  SERVICE_CREATE_FAIL,
  SERVICE_CREATE_REQUEST,
  SERVICE_CREATE_SUCCESS,
  SERVICE_DETAILS_FAIL,
  SERVICE_DETAILS_REQUEST,
  SERVICE_DETAILS_SUCCESS,
  UPDATE_SERVICE_FAIL,
  UPDATE_SERVICE_REQUEST,
  UPDATE_SERVICE_SUCCESS,
} from '../constants/serviceConstants';

// New Service ---ADMIN
export const newService = (serviceData) => async (dispatch) => {
  try {
    dispatch({ type: SERVICE_CREATE_REQUEST });
    const config = { header: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post(
      `/api/v1/services/new`,
      serviceData,
      config
    );

    dispatch({
      type: SERVICE_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SERVICE_CREATE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get all services ---ADMIN
export const getAllServices = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_SERVICES_REQUEST });
    const { data } = await axios.get(`/api/v1/services`);

    dispatch({
      type: ALL_SERVICES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_SERVICES_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Service Details
export const getServiceDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SERVICE_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/services/${id}`);

    dispatch({
      type: SERVICE_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SERVICE_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Service ---ADMIN
export const updateService = (id, serviceData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SERVICE_REQUEST });

    const config = { header: { 'Content-Type': 'application/json' } };

    const { data } = await axios.put(
      `/api/v1/admin/services/${id}`,
      serviceData,
      config
    );

    dispatch({
      type: UPDATE_SERVICE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_SERVICE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Service ---ADMIN
export const deleteService = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_SERVICE_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/services/${id}`);

    dispatch({
      type: DELETE_SERVICE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_SERVICE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// get service item ---ADMIN
export const getServiceItem = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_SERVICE_ITEM_REQUEST });
    const { data } = await axios.get(`/api/v1/service/order-item/${id}`);

    dispatch({ type: GET_SERVICE_ITEM_SUCCESS, payload: data.service_item });
  } catch (error) {
    dispatch({
      type: GET_SERVICE_ITEM_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear All Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
