import { combineReducers } from 'redux';
import weatherReducer from './weatherReducer';
import cryptoReducer from './cryptoReducer';
import newsReducer from './newsReducer';
import notificationReducer from './notificationReducer';
import favoriteReducer from './favoriteReducer';

const rootReducer = combineReducers({
  weather: weatherReducer,
  crypto: cryptoReducer,
  news: newsReducer,
  notifications: notificationReducer,
  favorites: favoriteReducer,
});

export default rootReducer;