import MongoDb from '@/db'
import { MongoClient } from 'mongodb'

jest.mock('mongodb', () => {
  const mockConnect = jest.fn()
  const mockClose = jest.fn()

  const mockMongoClient = {
    MongoClient: jest.fn().mockImplementation(() => ({
      connect: mockConnect,
      close: mockClose,
    })),
  }

  return mockMongoClient
})

describe('MongoDb class', () => {
  let mockMongoClient: jest.Mocked<MongoClient>
  const url = process.env.MONGO_URL || 'mongodb://localhost:27017'

  beforeEach(() => {
    mockMongoClient = new MongoClient(url) as jest.Mocked<MongoClient>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should instantiate MongoClient with the correct URL', () => {
    expect(MongoClient).toHaveBeenCalledWith(url)
  })

  test('error when connecting to MongoDB', async () => {
    // Correctly mock `connect` to reject
    const err = new Error('Network Error')
    mockMongoClient.connect.mockRejectedValueOnce(err)
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation()

    await MongoDb.connect()
    expect(spyConsoleError).toHaveBeenCalledWith('Error connecting to MongoDB:', err)
    spyConsoleError.mockRestore()
  })

  test('should connect to MongoDB', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation()

    await MongoDb.connect()

    expect(log).toHaveBeenCalledWith('Connected to MongoDB')

    log.mockRestore()
  })

  test('should return the client', async () => {
    await MongoDb.connect()
    const client = MongoDb.client
    expect(client).toBeDefined()
  })
})
