import {
  ALL_SERVICES_FAIL,
  ALL_SERVICES_REQUEST,
  ALL_SERVICES_SUCCESS,
  CLEAR_ERRORS,
  DELETE_SERVICE_FAIL,
  DELETE_SERVICE_REQUEST,
  DELETE_SERVICE_RESET,
  DELETE_SERVICE_SUCCESS,
  SERVICE_CREATE_FAIL,
  SERVICE_CREATE_REQUEST,
  SERVICE_CREATE_RESET,
  SERVICE_CREATE_SUCCESS,
  SERVICE_DETAILS_FAIL,
  SERVICE_DETAILS_REQUEST,
  SERVICE_DETAILS_SUCCESS,
  UPDATE_SERVICE_FAIL,
  UPDATE_SERVICE_REQUEST,
  UPDATE_SERVICE_RESET,
  UPDATE_SERVICE_SUCCESS,
} from '../constants/serviceConstants';

// create service reducer
export const serviceCreateReducer = (
  state = { service: {} },
  { type, payload }
) => {
  switch (type) {
    case SERVICE_CREATE_REQUEST:
      return {
        loading: true,
      };
    case SERVICE_CREATE_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        service: payload.service,
      };
    case SERVICE_CREATE_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case SERVICE_CREATE_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// get all services reducer
export const allServicesReducer = (
  state = { services: [] },
  { type, payload }
) => {
  switch (type) {
    case ALL_SERVICES_REQUEST:
      return {
        loading: true,
      };
    case ALL_SERVICES_SUCCESS:
      return {
        loading: false,
        services: payload.services,
        servicesCount: payload.servicesCount,
      };
    case ALL_SERVICES_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// service details reducer
export const serviceDetailsReducer = (
  state = { service: {} },
  { type, payload }
) => {
  switch (type) {
    case SERVICE_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SERVICE_DETAILS_SUCCESS:
      return {
        loading: false,
        service: payload.service,
      };
    case SERVICE_DETAILS_FAIL:
      return {
        ...state,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// update service reducer
export const serviceReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case UPDATE_SERVICE_REQUEST:
    case DELETE_SERVICE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_SERVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: payload,
      };
    case DELETE_SERVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: payload,
      };
    case UPDATE_SERVICE_FAIL:
    case DELETE_SERVICE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case UPDATE_SERVICE_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case DELETE_SERVICE_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
