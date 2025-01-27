import ProductService from './product.service'
import { createProductSchema } from './product.model'

import { getMongoClient } from '@/db'
import ProductRepository from './product.repository'
import { Router } from '@/lib/serve'

const productDb = getMongoClient('product')
const productCollection = productDb.collection('product')
const productRepository = new ProductRepository(productCollection)
const productService = new ProductService(productRepository)

const productHandler = Router()

productHandler.post(
  '/',
  async (ctx) => {
    const product = await productService.createProduct(ctx.body)
    ctx.response(201, product)
  },
  {
    schema: {
      body: createProductSchema,
    },
  }
)

productHandler.get('/', async (ctx) => {
  const products = await productService.getProducts()
  ctx.response(200, products)
})

productHandler.get('/:id', async (ctx) => {
  const product = await productService.getProductById(ctx.params.id)
  if (!product) {
    ctx.response(404, { message: 'Product not found' })
    return
  }
  ctx.response(200, product)
})

export default productHandler
