import HttpService, { HttpOption } from '@/lib/external-service/http-service'
import { Router } from '@/lib/serve'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
})

export const UserModel = mongoose.model('User', userSchema)

const userRouter = Router()

userRouter.get('/', async (ctx) => {
  const users = await UserModel.find()
  console.log('users', users)
  ctx.response(200, users)
})

userRouter.post('/', async (ctx) => {
  const user = new UserModel(ctx.body)
  await user.save()

  ctx.response(201, user)
})

userRouter.get('/:id', async (ctx) => {
  const userApi = new HttpService()

  const options: HttpOption = {
    url: 'http://localhost:3001/users/:id',
    method: 'GET',
    params: { id: ctx.params.id },
  }

  const user = await userApi.requestHttp(options)
  ctx.response(user.status, user.data)
})

export default userRouter.Router('users')
