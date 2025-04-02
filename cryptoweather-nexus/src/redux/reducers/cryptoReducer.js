import {
  FETCH_CRYPTO_REQUEST,
  FETCH_CRYPTO_SUCCESS,
  FETCH_CRYPTO_FAILURE,
} from '../actions/cryptoActions';

const initialState = {
  loading: false,
  data: [],
  previousPrices: {},
  error: null,
};

export const UPDATE_CRYPTO_PRICE = 'UPDATE_CRYPTO_PRICE';

const cryptoReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CRYPTO_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CRYPTO_SUCCESS:
      const previousPrices = {};
      action.payload.forEach((crypto) => {
        previousPrices[crypto.id] = crypto.current_price;
      });
      return {
        ...state,
        loading: false,
        data: action.payload, // Replace data entirely to ensure new cryptos show
        previousPrices,
        error: null,
      };
    case FETCH_CRYPTO_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_CRYPTO_PRICE:
      const { cryptoId, newPrice } = action.payload;
      const updatedData = state.data.map((crypto) => {
        if (crypto.id === cryptoId) {
          return { ...crypto, current_price: newPrice };
        }
        return crypto;
      });
      const newPreviousPrices = { ...state.previousPrices, [cryptoId]: newPrice };
      return {
        ...state,
        data: updatedData,
        previousPrices: newPreviousPrices,
      };
    default:
      return state;
  }
};

export default cryptoReducer;