import AppServer from './lib/serve'
import productRouter from './product/product.route'
import userRouter from './users/user'
 
const app = new AppServer()

app.router(productRouter)
app.router(userRouter)

export default app.register()
