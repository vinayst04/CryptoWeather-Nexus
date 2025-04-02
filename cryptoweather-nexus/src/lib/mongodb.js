import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

console.log('MongoDB URI:', uri.replace(/:([^@]+)@/, ':<password>@'));

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    console.log('Connecting to MongoDB in development mode...');
    global._mongoClientPromise = client.connect().catch(err => {
      console.error('MongoDB connection failed:', err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  console.log('Connecting to MongoDB in production mode...');
  clientPromise = client.connect().catch(err => {
    console.error('MongoDB connection failed:', err);
    throw err;
  });
}

export default clientPromise;