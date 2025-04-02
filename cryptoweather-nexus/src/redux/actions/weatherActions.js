import { getWeather } from '../../utils/api';

export const FETCH_WEATHER_REQUEST = 'FETCH_WEATHER_REQUEST';
export const FETCH_WEATHER_SUCCESS = 'FETCH_WEATHER_SUCCESS';
export const FETCH_WEATHER_FAILURE = 'FETCH_WEATHER_FAILURE';

export const fetchWeather = (cities) => async (dispatch) => {
  dispatch({ type: FETCH_WEATHER_REQUEST });
  try {
    const data = await getWeather(cities);
    dispatch({ type: FETCH_WEATHER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_WEATHER_FAILURE, payload: error.message });
  }
};