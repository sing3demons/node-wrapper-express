import express from 'express'
import userRouter from './users/user'
import productRouter from './product/product.route'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', userRouter)
app.use('/products', productRouter)

export default app
