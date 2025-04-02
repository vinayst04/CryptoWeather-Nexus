import { ADD_NOTIFICATION, CLEAR_NOTIFICATION } from '../actions/notificationActions';

const initialState = [];

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return [...state, action.payload];
    case CLEAR_NOTIFICATION:
      return state.filter((_, index) => index !== action.payload);
    default:
      return state;
  }
};

export default notificationReducer;