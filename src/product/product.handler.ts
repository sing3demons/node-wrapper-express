import { Request, Response } from 'express'
import { IProductService } from './product.service'
import { createProductDTO } from './product.model'

export interface IProductHandler {
  createProduct(req: Request, res: Response): Promise<void>
  fetchProducts(req: Request, res: Response): Promise<void>
  fetchProductById(req: Request, res: Response): Promise<void>
}

export default class ProductHandler {
  constructor(private productService: IProductService) {}

  async createProduct(req: Request<any, createProductDTO, createProductDTO, any>, res: Response) {
    try {
      const product = await this.productService.createProduct(req.body)
      res.status(201).json(product)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'An error occurred while creating a product' })
      }
    }
  }

  async fetchProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.getProducts()
      res.status(200).json(products)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'An error occurred while fetching products' })
      }
    }
  }

  async fetchProductById(req: Request, res: Response) {
    try {
      const product = await this.productService.getProductById(req.params.id)
      if (!product) {
        res.status(404).json({ message: 'Product not found' })
        return
      }
      res.status(200).json(product)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'An error occurred while fetching product' })
      }
    }
  }
}
