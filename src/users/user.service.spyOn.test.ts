import axios from 'axios'
import { mockUsers } from './user.mock'
import UserService from './user.service'

describe('UserService spyOn', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('success when create user', async () => {
    const mockSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockUsers })

    const users = await userService.getUsers()
    expect(users).toEqual(mockUsers)
    expect(mockSpy).toHaveBeenCalledWith('http://localhost:3000/users')
    mockSpy.mockRestore()
  })

  test('error when create user', async () => {
    const mockSpy = jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Network Error'))

    await expect(userService.getUsers()).rejects.toThrow('Network Error')
    expect(mockSpy).toHaveBeenCalledWith('http://localhost:3000/users')
    mockSpy.mockRestore()
  })
})
