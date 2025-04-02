export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';

export const addFavorite = (type, item) => ({
  type: ADD_FAVORITE,
  payload: { type, item },
});

export const removeFavorite = (type, item) => ({
  type: REMOVE_FAVORITE,
  payload: { type, item },
});