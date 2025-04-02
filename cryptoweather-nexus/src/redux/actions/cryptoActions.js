import { getCrypto } from '../../utils/api';
import { UPDATE_CRYPTO_PRICE } from '../reducers/cryptoReducer';

export const FETCH_CRYPTO_REQUEST = 'FETCH_CRYPTO_REQUEST';
export const FETCH_CRYPTO_SUCCESS = 'FETCH_CRYPTO_SUCCESS';
export const FETCH_CRYPTO_FAILURE = 'FETCH_CRYPTO_FAILURE';

export const fetchCrypto = (cryptos) => async (dispatch) => {
  dispatch({ type: FETCH_CRYPTO_REQUEST });
  try {
    console.log('Fetching crypto data for:', cryptos);
    const data = await getCrypto(cryptos); // Ensure getCrypto uses the full array
    console.log('Crypto data fetched:', data);
    dispatch({ type: FETCH_CRYPTO_SUCCESS, payload: data });
  } catch (error) {
    console.error('Crypto fetch error:', error.message);
    dispatch({ type: FETCH_CRYPTO_FAILURE, payload: error.message });
  }
};

export const updateCryptoPrice = (cryptoId, newPrice) => ({
  type: UPDATE_CRYPTO_PRICE,
  payload: { cryptoId, newPrice },
});