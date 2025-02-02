import request from 'supertest'
import server from '../server'
import { UserModel } from './user'
import HttpService from '@/lib/external-service/http-service'

const app = server.register()
describe('User', () => {
  afterAll(async () => {
    jest.clearAllMocks()
  })
  it('should get all users', async () => {
    jest.spyOn(UserModel, 'find').mockResolvedValue([])

    const response = await request(app).get('/users')
    expect(response.status).toBe(200)
  })

  it('should create a user', async () => {
    jest.spyOn(UserModel.prototype, 'save').mockResolvedValue({})

    const response = await request(app).post('/users').send({ name: 'John', email: '' })

    expect(response.status).toBe(201)
  })

  test('should get a user by id', async () => {
    jest.spyOn(HttpService.prototype, 'requestHttp').mockResolvedValue({
      data: { name: 'John', email: '' },
      status: 200,
    })

    const response = await request(app).get('/users/1')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ name: 'John', email: '' })
  })

  test('should return 404 if user not found', async () => {
    jest.spyOn(HttpService.prototype, 'requestHttp').mockResolvedValue({
      data: {},
      status: 404,
    })

    const response = await request(app).get('/users/1')

    expect(response.status).toBe(404)
  })
})
