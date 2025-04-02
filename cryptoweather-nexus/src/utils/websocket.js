import { updateCryptoPrice } from '../redux/actions/cryptoActions';

export const initWebSocket = (dispatch) => {
  const ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,binance-coin');

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket message:', data);
    for (const [cryptoId, newPrice] of Object.entries(data)) {
      dispatch(updateCryptoPrice(cryptoId, parseFloat(newPrice)));
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
  };

  return ws;
};