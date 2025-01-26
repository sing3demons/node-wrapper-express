import { Router } from 'express'
import ProductRepository from './product.repository'
import { getMongoClient } from '../db'
import { IProduct } from './product.model'
import ProductService from './product.service'
import ProductHandler from './product.handler'

const productRouter = Router()

const productDb = getMongoClient('product')
// productDb.createIndex('product', { id: 1 }, { unique: true })

const productCollection = productDb.collection('product')
const productRepository = new ProductRepository(productCollection)
const productService = new ProductService(productRepository)
const productHandler = new ProductHandler(productService)
// GET /product

productRouter.post('/', productHandler.createProduct.bind(productHandler))
productRouter.get('/', productHandler.fetchProducts.bind(productHandler))
productRouter.get('/:id', productHandler.fetchProductById.bind(productHandler))

export default productRouter
