import request from 'supertest'
import app from '../server'
import { UserModel } from './user'

describe('User', () => {
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
})
