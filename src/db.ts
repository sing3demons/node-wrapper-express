import { MongoClient } from 'mongodb'

class MongoDb {
  private url = process.env.MONGO_URL || 'mongodb://localhost:27017'
  private readonly _client: MongoClient

  constructor() {
    this._client = new MongoClient(this.url)
    console.log('MongoDb class instantiated')
  }

  async connect() {
    try {
      await this._client.connect()
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
    }
  }

  get client() {
    return this._client
  }
}

export default new MongoDb()
