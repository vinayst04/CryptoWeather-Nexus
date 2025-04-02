import { FaGithub, FaTwitter, FaRocket } from 'react-icons/fa';

export default function Footer({ className }) {
  return (
    <footer className={`bg-gradient-to-r from-gray-900 to-gray-800 py-6 text-center text-neon-blue w-full ${className}`}>
      <div className="container mx-auto">
        <div className="flex justify-center gap-6 mb-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-neon-purple transition">
            <FaGithub size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-neon-purple transition">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="hover:text-neon-purple transition">
            <FaRocket size={24} />
          </a>
        </div>
        <p className="text-sm tracking-wider">
          © {new Date().getFullYear()} CryptoWeather Nexus. Powered by the Future.
        </p>
        <div className="mt-2">
          <span className="inline-block w-16 h-1 bg-neon-blue animate-pulse"></span>
        </div>
      </div>
    </footer>
  );
}