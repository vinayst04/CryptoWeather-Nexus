import { useState } from 'react';
import { FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../redux/actions/favoriteActions';

export default function Header({ theme, setTheme, addBottomAlert }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleFavorite = (type, item) => {
    dispatch(removeFavorite(type, item));
    addBottomAlert(`${item} removed from favorites`, 'success');
  };

  const handleSignIn = () => {
    signIn('google').then(() => {
      addBottomAlert('Sign-up successful', 'success');
    }).catch(() => {
      addBottomAlert('Sign-up unsuccessful', 'error');
    });
  };

  const handleSignOut = () => {
    signOut().then(() => {
      addBottomAlert('Logout successful', 'success');
    }).catch(() => {
      addBottomAlert('Logout unsuccessful', 'error');
    });
  };

  return (
    <header className="p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold text-neon-blue animate-pulse">CryptoWeather Nexus</h1>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="button p-2 rounded-full">
          {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
        {session ? (
          <div className="relative">
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="button p-2 rounded-full">
              <FaUserCircle size={24} />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <p className="text-sm text-neon-blue">{session.user.email}</p>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-neon-blue">Favorites</h3>
                    {favorites.cities.length === 0 && favorites.cryptos.length === 0 ? (
                      <p className="text-sm text-gray-400">No favorites added yet.</p>
                    ) : (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        {favorites.cities.map((city) => (
                          <div key={city} className="flex justify-between items-center py-1">
                            <p className="text-sm text-gray-300">City: {city}</p>
                            <button
                              onClick={() => handleFavorite('cities', city)}
                              className="text-red-400 hover:text-red-600 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {favorites.cryptos.map((crypto) => (
                          <div key={crypto} className="flex justify-between items-center py-1">
                            <p className="text-sm text-gray-300">Crypto: {crypto}</p>
                            <button
                              onClick={() => handleFavorite('cryptos', crypto)}
                              className="text-red-400 hover:text-red-600 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={handleSignOut} className="button mt-4 w-full">Logout</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSignIn} className="button">Sign In</button>
            <button onClick={handleSignIn} className="button">Sign Up</button>
          </div>
        )}
      </div>
    </header>
  );
}