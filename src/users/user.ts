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

export default userRouter.Router('users')
