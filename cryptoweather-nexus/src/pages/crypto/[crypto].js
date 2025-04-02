import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCrypto } from '../../redux/actions/cryptoActions';

export default function CryptoDetail() {
  const router = useRouter();
  const { crypto } = router.query;
  const dispatch = useDispatch();
  const cryptoData = useSelector((state) => state.crypto);

  useEffect(() => {
    if (crypto) {
      dispatch(fetchCrypto([crypto]));
    }
  }, [crypto, dispatch]);

  if (!crypto) return <p>Loading...</p>;

  const cryptoInfo = cryptoData.data.find((c) => c.id.toLowerCase() === crypto.toLowerCase());

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{crypto} Details</h1>
      {cryptoData.loading && <p>Loading...</p>}
      {cryptoData.error && <p className="text-red-500">{cryptoData.error}</p>}
      {cryptoInfo ? (
        <div className="card">
          <h2 className="text-xl font-semibold">{cryptoInfo.name}</h2>
          <p>Price: ${cryptoInfo.current_price.toFixed(2)}</p>
          <p>24h Change: {cryptoInfo.price_change_percentage_24h.toFixed(2)}%</p>
          <p>Market Cap: ${cryptoInfo.market_cap.toLocaleString()}</p>
          {/* Placeholder for historical data */}
          <p className="mt-4">Historical pricing not available in free API plan.</p>
        </div>
      ) : (
        <p>No data available for {crypto}.</p>
      )}
    </div>
  );
}