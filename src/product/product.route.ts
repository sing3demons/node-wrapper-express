import { Router } from '@/lib/serve'
import ProductHandler from './product.handler'
import ProductService from './product.service'
import mongoClient from '@/db'
import ProductRepository from './product.repository'

const productDb = mongoClient.client.db('product')
const productCollection = productDb.collection('product')
const productRepository = new ProductRepository(productCollection)
const productService = new ProductService(productRepository)
const productHandler = new ProductHandler(productService)

const productRouter = Router()

productRouter.post('/', productHandler.createProduct)
productRouter.get('/', productHandler.getProduct)
productRouter.get('/:id', productHandler.getProductById)

export default productRouter.Router('products')
