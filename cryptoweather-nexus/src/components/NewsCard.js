import Tilt from 'react-parallax-tilt';

export default function NewsCard({ article }) {
  const truncatedDescription = article.description
    ? article.description.length > 100
      ? article.description.substring(0, 100) + '...'
      : article.description
    : 'No description available';

  const imageUrl = article.urlToImage || article.image_url || 'https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?auto=format&fit=crop&w=150&q=80';

  return (
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.3} glareColor="#00f7ff"> {/* Reduced from 15 to 5 */}
      <div className="card bg-secondary flex flex-col sm:flex-row items-center gap-4 p-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold line-clamp-2">{article.title}</h3>
          <p className="line-clamp-3 text-sm text-gray-300">{truncatedDescription}</p>
          <a href={article.url || article.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Read more
          </a>
        </div>
        <img
          src={imageUrl}
          alt={article.title}
          className="w-24 h-24 object-cover rounded-lg"
          onError={(e) => { e.target.src = 'https://placehold.co/150x150'; }}
        />
      </div>
    </Tilt>
  );
}