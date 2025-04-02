import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('cryptoweather');
  const collection = db.collection('users');

  if (req.method === 'POST') {
    const { userId, cities, cryptos, favorites } = req.body;
    await collection.updateOne(
      { userId },
      { $set: { cities, cryptos, favorites } },
      { upsert: true }
    );
    res.status(200).json({ message: 'User data saved' });
  } else if (req.method === 'GET') {
    const { userId } = req.query;
    const userData = await collection.findOne({ userId });
    res.status(200).json(userData || { cities: [], cryptos: [], favorites: { cities: [], cryptos: [] } });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}