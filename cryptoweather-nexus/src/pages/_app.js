import '../styles/globals.css';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';

const TsParticles = dynamic(() => import('@tsparticles/react'), { ssr: false });

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [theme, setTheme] = useState('dark');
  const [bottomAlerts, setBottomAlerts] = useState([]);

  const addBottomAlert = (message, type = 'success') => {
    const id = Date.now();
    setBottomAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setBottomAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 5000);
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.body.style.setProperty('--cursor-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stars = Array.from({ length: 50 }, (_, i) => {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * -5;
    return (
      <div
        key={i}
        className="star"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          animationName: `moveRandom${i % 4}`,
          animationIterationCount: 'infinite',
        }}
      />
    );
  });

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <div className={`min-h-screen ${theme}`}>
          <TsParticles
            id="tsparticles"
            options={{
              background: { color: { value: "transparent" } },
              fpsLimit: 60,
              interactivity: {
                events: { onClick: { enable: true, mode: "push" }, onHover: { enable: true, mode: "repulse" }, resize: true },
                modes: { push: { quantity: 4 }, repulse: { distance: 100, duration: 0.4 } },
              },
              particles: {
                color: { value: "#00f7ff" },
                links: { color: "#00f7ff", distance: 150, enable: true, opacity: 0.4, width: 1 },
                collisions: { enable: true },
                move: { direction: "none", enable: true, outModes: { default: "out" }, random: false, speed: 2, straight: false },
                number: { density: { enable: true, area: 800 }, value: 80 },
                opacity: { value: 0.5 },
                shape: { type: "circle" },
                size: { random: true, value: 3 },
              },
              detectRetina: true,
            }}
            className="fixed inset-0 z-0 pointer-events-none"
          />
          <div className="stars">{stars}</div>
          <Header theme={theme} setTheme={setTheme} addBottomAlert={addBottomAlert} />
          <Component {...pageProps} addBottomAlert={addBottomAlert} />
          {/* Bottom Alerts */}
          <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-50">
            {bottomAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-gray-800 text-white p-4 rounded-lg shadow-lg animate-slide-up max-w-sm w-full text-center border-l-4 ${
                  alert.type === 'success' ? 'border-neon-blue' : alert.type === 'error' ? 'border-red-500' : 'border-yellow-500'
                }`}
              >
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;