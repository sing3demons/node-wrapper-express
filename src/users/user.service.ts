import axios, { AxiosResponse } from 'axios'

export interface IUserService {
  getUsers(): Promise<User[]>
}

class UserService implements IUserService {
  async getUsers() {
    try {
      const response = await axios.get<{}, AxiosResponse<User[]>>('http://localhost:3000/users')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default UserService

export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}

export interface Geo {
  lat: string
  lng: string
}

export interface Company {
  name: string
  catchPhrase: string
  bs: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}
