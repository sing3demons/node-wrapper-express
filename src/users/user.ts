import mongoose from 'mongoose'
import express from 'express'

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
})

export const UserModel = mongoose.model('User', userSchema)

const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
  const users = await UserModel.find()
  console.log('users', users)
  res.json(users)
})

userRouter.post('/', async (req, res) => {
  const user = new UserModel(req.body)
  await user.save()
  res.json(user)
})

export default userRouter
