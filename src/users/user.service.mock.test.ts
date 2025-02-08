import axios from 'axios'
import UserService from './user.service'
import { mockUsers } from './user.mock'

jest.mock('axios')

describe('UserService', () => {
  let userService: UserService
  const mockedAxios = axios as jest.Mocked<typeof axios>

  beforeEach(() => {
    userService = new UserService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should fetch users successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockUsers })

    const users = await userService.getUsers()
    expect(users).toEqual(mockUsers)
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/users')
  })

  test('should handle errors when fetching users', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'))

    await expect(userService.getUsers()).rejects.toThrow('Network Error')
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/users')
  })
})
