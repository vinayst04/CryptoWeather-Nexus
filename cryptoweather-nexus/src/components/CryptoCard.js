import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Tilt from 'react-parallax-tilt';

export default function CryptoCard({ cryptoData, onFavorite, onDelete }) {
  const [priceClass, setPriceClass] = useState('');
  const prevPriceRef = useRef(cryptoData.current_price);
  const lastAnimationTimeRef = useRef(0);
  const ANIMATION_DEBOUNCE_MS = 1000;

  useEffect(() => {
    const previousPrice = prevPriceRef.current;
    const currentPrice = cryptoData.current_price;
    const currentTime = Date.now();

    prevPriceRef.current = currentPrice;

    if (previousPrice !== currentPrice) {
      setPriceClass(currentPrice > previousPrice ? 'price-up' : 'price-down');
      if (currentTime - lastAnimationTimeRef.current >= ANIMATION_DEBOUNCE_MS) {
        lastAnimationTimeRef.current = currentTime;
      }
    }
  }, [cryptoData.current_price]);

  return (
    <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable={true} glareMaxOpacity={0.3} glareColor="#00f7ff">
      <div className="card bg-secondary">
        <h3 className="text-lg font-semibold">
          <Link href={`/crypto/${cryptoData.id}`}>
            {cryptoData.name}
          </Link>
        </h3>
        <p>
          Price: $
          <span className={`price ${priceClass}`}>
            {cryptoData.current_price.toFixed(2)}
          </span>
        </p>
        <p>24h Change: {cryptoData.price_change_percentage_24h.toFixed(2)}%</p>
        <p>Market Cap: ${cryptoData.market_cap.toLocaleString()}</p>
        <button onClick={onFavorite} className="button mt-2 mr-2">Add to Favorites</button>
        <button onClick={onDelete} className="button mt-2 bg-red-600 hover:bg-red-700">Delete</button>
      </div>
    </Tilt>
  );
}