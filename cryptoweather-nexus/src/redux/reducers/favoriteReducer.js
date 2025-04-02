import { ADD_FAVORITE, REMOVE_FAVORITE } from '../actions/favoriteActions';

const initialState = {
  cities: [],
  cryptos: [],
};

const favoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FAVORITE:
      return {
        ...state,
        [action.payload.type]: [...state[action.payload.type], action.payload.item],
      };
    case REMOVE_FAVORITE:
      return {
        ...state,
        [action.payload.type]: state[action.payload.type].filter(
          (item) => item !== action.payload.item
        ),
      };
    default:
      return state;
  }
};

export default favoriteReducer;